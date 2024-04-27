"use server";

import { revalidatePath } from "next/cache";
import { resend } from "@/server/resend";

import {
  processCSV,
  processJSON,
  processMarkdown,
  processPdf,
  processTxt,
  type FileItemChunk,
} from "@/core/ingestions";

import { pinecone } from "@/core/db";

import { llmOpenAI } from "@/core/llm/openai";

import {
  createDocument,
  createDocumentChunk,
  deleteDocument,
  type DocumentItemIncluded,
} from "@/prisma/db/document";

import { createTeam, updateTeam } from "@/prisma/db/team";

import {
  updateAssistant,
  updateAssistantSettings,
} from "@/prisma/db/assistant";

import { createInvite } from "@/prisma/db/invite";

import {
  assistantMutationSchema,
  type AssistantMutationSchema,
} from "@/lib/schemas/assistant";

import {
  teamMutationSchema,
  teamCreationSchema,
  type TeamMutationSchema,
  type TeamCreationSchema,
} from "@/lib/schemas/team";

import { utapi } from "@/server/uploadthing";

import { toolSchema, type ToolSchema } from "@/lib/schemas/tool";
import { updateUser } from "@/prisma/db/user";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const updateAssistantAction = async (
  params: {
    teamId: string;
    assistantId: string;
  },
  formData: AssistantMutationSchema
) => {
  "use server";

  const { teamId, assistantId } = params;

  const validatedFields = assistantMutationSchema.safeParse({
    name: formData.name,
    visibility: formData.visibility,
    status: formData.status,
    systemPrompt: formData.systemPrompt,
    welcomeMessage: formData.welcomeMessage,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // # update assistant
  await updateAssistant(assistantId, formData);
  revalidatePath(`/app/${teamId}/${assistantId}/settings`);
};

export const updateAssistantSettingAction = async (
  params: {
    teamId: string;
    assistantId: string;
  },
  formData: ToolSchema
) => {
  "use server";

  const { teamId, assistantId } = params;

  const validatedFields = toolSchema.safeParse({
    model: formData.model,
    systemPrompt: formData.systemPrompt,
    welcomeMessage: formData.welcomeMessage,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // # update assistant settings
  await updateAssistantSettings(assistantId, formData);
  revalidatePath(`/app/${teamId}/${assistantId}/playground`);
};

export const createTeamAction = async (
  params: {
    userId: string;
    teamId: string;
  },
  formData: TeamCreationSchema
) => {
  "use server";

  const { userId, teamId } = params;

  const validatedFields = teamCreationSchema.safeParse({
    name: formData.name,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // # create team
  await createTeam(userId, formData);
  revalidatePath(`/app/${teamId}`);
};

export const updateTeamAction = async (formData: TeamMutationSchema) => {
  "use server";

  const validatedFields = teamMutationSchema.safeParse({
    id: formData.id,
    name: formData.name,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // # update team
  await updateTeam(formData.id, formData);
  revalidatePath(`/app/${formData.id}/settings`);
};

export const createDocumentAction = async (formData: FormData) => {
  "use server";

  const files = formData.getAll("files") as File[];
  const assistantId = formData.get("assistantId") as string;

  let _temp = {} as {
    [k in string]: {
      name: string;
      ext: string;
      chunks: FileItemChunk[];
    };
  };

  for (const file of files) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([fileBuffer]);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    console.log("file_ext", fileExtension);

    let chunks: FileItemChunk[] = [];

    switch (fileExtension) {
      case "csv":
        chunks = await processCSV(blob);
        break;
      case "json":
        chunks = await processJSON(blob);
        break;
      case "md":
        chunks = await processMarkdown(blob);
        break;
      case "pdf":
        chunks = await processPdf(blob);
        break;
      case "txt":
        chunks = await processTxt(blob);
        break;
      default:
        throw new Error("Invalid file extension!");
    }

    _temp = {
      ..._temp,
      [file.name]: {
        ...[file.name],
        name: file.name,
        ext: fileExtension,
        chunks,
      },
    };
  }

  // # upload file to uploadthings server
  const resp = await utapi.uploadFiles(files);

  for (const fileResp of resp) {
    const { data, error } = fileResp;

    if (error) {
      throw new Error(error.message);
    }

    const { key, name } = data;
    const _tempData = _temp[name];

    // # create document
    const document = await createDocument({
      fileId: key,
      name,
      fileExt: _tempData.ext,
      assistantId,
    });

    if (!document) {
      throw new Error("Failed to create document!");
    }

    // # create embedding
    const response = await llmOpenAI.generateEmbedding(
      _tempData.chunks.map((chunk) => chunk.content),
      "text-embedding-3-small"
    );

    let embeddings = response.data.map((item: any) => {
      return item.embedding;
    });

    console.log(embeddings.length);

    // # run in parallel?
    await Promise.all(
      _tempData.chunks.map(async (chunk, idx) => {
        // # add into pinecone
        await pinecone.upsert({
          id: `${key}_idx_chunk_${idx}`,
          values: embeddings[idx],
          metadata: {
            fileId: key,
            chunkIndex: idx,
            content: chunk.content,
          },
        });

        // # create document chunk
        await createDocumentChunk({
          fileId: key,
          chuckIndex: idx,
          content: chunk.content,
          tokens: chunk.tokens,
          documentId: document.id,
        });
      })
    );
  }

  console.log(resp);
  revalidatePath("/app/[teamId]/[assistantId]/document", "page");
};

export const deleteDocumentAction = async (data: DocumentItemIncluded[]) => {
  "use server";

  const fileIds = data.map((d) => d!.fileId);
  const docIds = data.map((d) => d!.id);

  // # delete document w/ chunks
  await Promise.all(
    docIds.map(async (id) => {
      await deleteDocument(id);
    })
  );

  // # delete from uploadthings
  await utapi.deleteFiles(fileIds);
  revalidatePath("/app/[teamId]/[assistantId]/document", "page");
};

export const revalidateAfterStream = async (id: string) => {
  "use server";

  // # revalidate after stream
  revalidatePath(`/app/[teamId]/[assistantId]/playground?chatId=${id}`, "page");
};

export const sendEmail = async (teamId: string, emails: string[]) => {
  "use server";

  const invites = [];

  for (const email of emails) {
    const invite = await createInvite({
      teamId,
      email,
    });

    invites.push(invite);
  }

  console.log("invites", invites);

  invites.forEach((invite) =>
    resend.emails.send({
      from: "onboarding@intellify.ai",
      to: invite!.recipientEmail,
      subject: "Your invite is here!",
      html: `<p>Your invite: http://localhost/invite/${invite?.code}</p>`,
    })
  );

  // # revalidate after stream
  revalidatePath("/app/[teamId]/members", "page");
};

export const updateUserPassword = async ({
  password,
  code,
}: {
  password: string;
  code: string;
}) => {
  "use server";

  const supabase = createClient();

  // # update user password
  const user = await updateUser(code, {
    password,
  });

  if (!user) throw new Error("Failed to update user!");

  // # auto sign in user
  await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  // # redirect user to their dashboard
  const teamId = user!.teams[0].teamId;
  revalidatePath("/login/set-password", "page");
  redirect(`/app/${teamId}`);
};

/**
 *
 * 1. after revalidathPath on line 291, it automatically remove the searchParams chatId => find a way to rewrite it back
 *
 *
 */

"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DocumentItemIncluded } from "@/prisma/db/document";
import { JobItemIncluded } from "@/prisma/db/job";
import { SessionSchema, sessionSchema } from "@/prisma/db/session";

interface CopilotLauncherProps {
  documents: DocumentItemIncluded[] | null;
  jobs: JobItemIncluded[] | null;
  createSessionAction: (data: SessionSchema) => Promise<
    | {
        error: string;
      }
    | {
        error: null;
      }
  >;
}

export function CopilotLauncher({
  documents,
  jobs,
  createSessionAction,
}: CopilotLauncherProps) {
  const [showCopilotDialog, setShowCopilotDialog] = useState(false);

  const resumes = useMemo(() => {
    return documents?.filter((d) => d?.type == "resume");
  }, [documents]);

  const coverLetters = useMemo(() => {
    return documents?.filter((d) => d?.type == "cover_letter");
  }, [documents]);

  const form = useForm<SessionSchema>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      totalTime: "60_M",
    },
  });

  const onSubmit = async (values: SessionSchema) => {
    const { error } = await createSessionAction(values);

    if (error) {
      toast(error);
    } else {
      toast("Created interview session!");
    }

    setShowCopilotDialog(false);
    form.reset();
  };

  return (
    <Dialog open={showCopilotDialog} onOpenChange={setShowCopilotDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 border border-solid border-zinc-200"
        >
          Create Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Copilot Interview Launcher</DialogTitle>
          <DialogDescription>
            Choose your resume and cover letter below to allow copilot to
            understand as much information as possible!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) =>
                  console.log(errors)
                )}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Required) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Session Name"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resumeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume (Required) *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select A Resume" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resumes &&
                            resumes.length > 0 &&
                            resumes.map((d) => (
                              <SelectItem key={d!.id} value={d!.id}>
                                {d?.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverLetterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select A Cover Letter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {coverLetters &&
                            coverLetters.length > 0 &&
                            coverLetters.map((d) => (
                              <SelectItem key={d!.id} value={d!.id}>
                                {d?.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Application (Required) *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select A Job Application" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobs &&
                            jobs.length > 0 &&
                            jobs.map((d) => (
                              <SelectItem key={d!.id} value={d!.id}>
                                {d?.position} @ {d?.company}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add additional information about the interview or yourself"
                          className="resize-none border border-solid"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant={"default"}>
                  Create Copilot
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

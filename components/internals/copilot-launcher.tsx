"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DocumentItemIncluded } from "@/prisma/db/document";

interface CopilotLauncherProps {
  documents: DocumentItemIncluded[] | null;
}

const FormSchema = z.object({
  resumeId: z.string(),
  coverLetterId: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export function CopilotLauncher({ documents }: CopilotLauncherProps) {
  const resumes = useMemo(() => {
    return documents?.filter((d) => d?.type == "resume");
  }, [documents]);

  const coverLetters = useMemo(() => {
    return documents?.filter((d) => d?.type == "cover_letter");
  }, [documents]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // dotod
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 border border-solid border-zinc-200"
        >
          Create Copilot Session
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
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="resumeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume (Required)</FormLabel>
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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

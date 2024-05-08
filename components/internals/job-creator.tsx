"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";

import { JobSchema, jobSchema } from "@/prisma/db/job";

interface JobCreatorProps {
  createJobAction: (data: JobSchema) => Promise<void>;
}

export function JobCreator({ createJobAction }: JobCreatorProps) {
  const [showJobDialog, setShowJobDialog] = useState(false);

  const form = useForm<JobSchema>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (values: JobSchema) => {
    await createJobAction(values);
    setShowJobDialog(false);
    form.reset();
    toast("Created job application!");
  };

  return (
    <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-4 border border-solid border-zinc-200"
        >
          Create Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Job Application</DialogTitle>
          <DialogDescription>
            Input essential job details to allow AI generate context based on
            it!
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
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Google" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add company details"
                          className="resize-none border border-solid"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add job descriptions"
                          className="resize-none border border-solid"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant={"default"}>
                  Create Job
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

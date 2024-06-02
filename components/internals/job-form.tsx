"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { JobSchema, jobSchema } from "@/prisma/db/job";

interface JobFormProps {
  // # just for now, fix later
  action: (data: any) => Promise<void>;
  formAction: "create" | "update";
  fields?: JobSchema & {
    id?: string;
  };
  onClose: () => void;
}

export function JobForm({ action, formAction, fields, onClose }: JobFormProps) {
  const form = useForm<JobSchema>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: fields?.company,
      companyDetail: fields?.companyDetail,
      position: fields?.position,
      jobDescription: fields?.jobDescription,
    },
  });

  const onSubmit = async (values: JobSchema) => {
    if (!fields && formAction == "create") {
      await action(values);
      toast("Created job application!");
    } else if (fields && fields.id && formAction == "update") {
      await action({
        ...values,
        id: fields.id,
      });

      toast("Updated job application!");
    }

    form.reset();
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Job Application</DialogTitle>
        <DialogDescription>
          Input essential job details to allow AI generate context based on it!
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
                {formAction == "create" ? "Create Job" : "Update Job"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </DialogContent>
  );
}

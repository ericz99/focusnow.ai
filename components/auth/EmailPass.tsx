"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/client";

import { emailUserSchema, EmailUserSchema } from "@/lib/schemas/user";

export function EmailPassAuth() {
  const supabase = createClient();
  const router = useRouter();
  const form = useForm<EmailUserSchema>({
    resolver: zodResolver(emailUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: EmailUserSchema) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      // # reload because it will be authenticated
      router.refresh();
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="mx-auto max-w-sm w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@yahoo.com"
                      {...field}
                      className="border border-solid border-zinc-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="border border-solid border-zinc-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <Link
          href="/login"
          className="w-full flex gap-2 justify-center text-sm mt-8"
        >
          <ArrowLeft size={18} />
          Other login options
        </Link>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

import { createClient } from "@/lib/supabase/client";

import { magicLinkSchema, MagicLinkSchema } from "@/lib/schemas/user";

export default function EmailAuth() {
  const supabase = createClient();
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<MagicLinkSchema>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: MagicLinkSchema) {
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (!error) {
      setSuccess("Check your email!");
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="mx-auto max-w-sm w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@yahoo.com"
                      {...field}
                      className="border border-solid border-zinc-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Send Magic Link
            </Button>
          </form>
        </Form>

        {success && (
          <Alert
            variant={"default"}
            className="text-green-600 text-center my-8 font-medium"
          >
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Link
          href="/login"
          className="w-full flex gap-2 justify-center text-sm mt-8"
        >
          <ArrowLeft size={18} />
          Other login options
        </Link>
      </div>

      <p className="mt-12 text-center text-sm text-neutral-500">
        By signing in, you agree to our{" "}
        <Link
          className="font-medium underline underline-offset-4"
          href="/legal/terms"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          className="font-medium underline underline-offset-4"
          href="/legal/privacy"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

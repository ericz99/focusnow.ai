"use client";

import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/lib/utils";

type AuthPageProps = {
  type: "signin" | "signup";
};

export default function AuthPage({ type }: AuthPageProps) {
  const supabase = createClient();

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="mx-auto max-w-sm w-full">
        <Auth
          view={type === "signup" ? "sign_up" : "sign_in"}
          redirectTo={`${getURL()}/api/auth/callback`}
          onlyThirdPartyProviders
          socialLayout="vertical"
          providers={["google"]}
          showLinks={false}
          otpType="magiclink"
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            extend: false,
            className: {
              button:
                "w-full rounded-md border-transparent text-white border-solid border-2 flex justify-center items-center gap-2 p-1.5 bg-zinc-900 text-sm font-medium transition-all ease-in-out duration-75 hover:bg-zinc-700",
              container: "flex flex-col gap-2 mb-1",
            },
          }}
          theme="default"
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Password",
              },
            },
          }}
        />
        <Button className="w-full flex gap-2" asChild>
          <Link href="/login/email">
            <Mail size={20} />
            Sign In using Magic Link
          </Link>
        </Button>

        <Button className="w-full flex gap-2 mt-2" asChild>
          <Link href="/login/email-pass">
            <Mail size={20} />
            Sign In using Password
          </Link>
        </Button>
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

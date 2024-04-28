import React from "react";
import Link from "next/link";
import { getURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function ConfirmSignUpPage({
  searchParams: { token },
}: {
  searchParams: { token: string };
}) {
  return (
    <div className="container mx-auto h-full w-full flex items-center relative">
      <div className="mx-auto mt-16 max-w-sm pb-2">
        <h1 className="text-sm text-center mb-6">
          You are about to sign in SaaSBoilerplate
        </h1>

        <Button
          variant={"ghost"}
          className="border-zinc-200 border border-solid w-full"
          asChild
        >
          <Link
            href={`${getURL()}/api/auth/confirm?token_hash=${token}&type=invite`}
          >
            Confirm Sign Up
          </Link>
        </Button>
      </div>
    </div>
  );
}

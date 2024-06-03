"use client";

import { ReactNode, useCallback, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com", // or 'https://eu.posthog.com' if your PostHog is hosted in Europe
  });
}

export function CSPostHogProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (path) {
      let url = window.origin + path;
      if (search.toString()) {
        url += "?" + search.toString();
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [path, search]);

  return (
    <PostHogProvider client={posthog}>
      <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
    </PostHogProvider>
  );
}

function PostHogAuthWrapper({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const getUserData = useCallback(async () => {
    const user = await supabase.auth.getUser();
    return user;
  }, [supabase]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data, error } = await getUserData();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          posthog.identify(data.user.id, {
            email: data.user.email,
          });
        } else {
          posthog.reset();
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadUserData();
  }, [getUserData]);

  return children;
}

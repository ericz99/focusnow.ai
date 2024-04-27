"use client";

import { useCallback, useState, useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/utils";

export default function useUser() {
  const { data, error, isLoading } = useSWR("/api/user", fetcher);
  const [userData, setUserData] = useState<User | null>(null);
  const [isMount, setMount] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const signOut = useCallback(async () => {
    if (!supabase?.auth) {
      router.push("/");
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: `Error signing out: ${error.message}`,
      });
      return;
    }

    setTimeout(() => {
      router.push("/login?authenticated=false");
    }, 500);
  }, [supabase.auth, toast, router]);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data) setUserData(data.user);
      setMount(true);
    }

    if (!isMount) {
      getUser();
    }
  }, [supabase.auth, isMount]);

  return { signOut, userData, isMount, data, error, isLoading };
}

"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { AssistantCreationSchema } from "@/lib/schemas/assistant";
import { useToast } from "@/components/ui/use-toast";

export default function useAssistants(teamId: string) {
  const { toast } = useToast();
  const {
    data: assistantDatas,
    error,
    isLoading,
    mutate,
  } = useSWR(["/api/assistant", teamId], ([url, teamId]) =>
    fetcher(url, {
      method: "GET",
      headers: {
        "x-team-id": teamId,
      },
    })
  );

  const createAssistant = async (data: AssistantCreationSchema) => {
    try {
      await fetch("/api/assistant", {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
        headers: {
          "x-team-id": teamId,
        },
      });

      // # trigger a mutation
      mutate();
    } catch (error: any) {
      console.error("Error creating assistant:", error);
      toast({
        title: `Error creating assistant: ${error.message}`,
      });
    }
  };

  return {
    data: assistantDatas,
    error,
    isLoading,
    createAssistant,
  };
}

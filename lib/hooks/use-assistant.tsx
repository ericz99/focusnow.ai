"use client";

import useSWR from "swr";

import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/utils";
import { AssistantMutationSchema } from "@/lib/schemas/assistant";

type AssistantFetcherProps = {
  teamId: string;
  assistantId: string;
};

export default function useAssistant({
  teamId,
  assistantId,
}: AssistantFetcherProps) {
  const { toast } = useToast();
  const { data, error, isLoading, mutate } = useSWR(
    [`/api/assistant/${assistantId}`, teamId],
    ([url, teamId]) =>
      fetcher(url, {
        method: "GET",
        headers: {
          "x-team-id": teamId,
        },
      })
  );

  const updateAssistant = async (data: AssistantMutationSchema) => {
    try {
      await fetch(`/api/assistant/${assistantId}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "x-team-id": teamId,
        },
      });

      // # trigger a mutation
      mutate();
    } catch (error: any) {
      console.error("Error updating assistant data:", error);
      toast({
        title: `Error updating assistant: ${error.message}`,
      });
    }
  };

  const deleteAssistant = async () => {
    try {
      await fetch(`/api/assistant/${assistantId}`, {
        method: "DELETE",
      });

      // # trigger a mutation
      mutate();
    } catch (error: any) {
      console.error("Error deleting assistant data:", error);
      toast({
        title: `Error deleting assistant: ${error.message}`,
      });
    }
  };

  return {
    data,
    error,
    isLoading,
    updateAssistant,
    deleteAssistant,
  };
}

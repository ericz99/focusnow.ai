"use client";

import useSWR from "swr";

import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/utils";
import { TeamMutationSchema } from "@/lib/schemas/team";

export default function useTeam(teamId: string) {
  const { toast } = useToast();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/team/${teamId}`,
    fetcher
  );

  const updateTeam = async (data: TeamMutationSchema) => {
    try {
      await fetch(`/api/team/${teamId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      // # trigger a mutation
      mutate();
    } catch (error: any) {
      console.error("Error updating team data:", error);
      toast({
        title: `Error updating team: ${error.message}`,
      });
    }
  };

  const deleteTeam = async () => {
    try {
      await fetch(`/api/team/${teamId}`, {
        method: "DELETE",
      });

      // # trigger a mutation
      mutate();
    } catch (error: any) {
      console.error("Error deleting team data:", error);
      toast({
        title: `Error deleting team: ${error.message}`,
      });
    }
  };

  return {
    data,
    error,
    isLoading,
    updateTeam,
    deleteTeam,
  };
}

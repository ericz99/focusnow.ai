"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { TeamCreationSchema } from "@/lib/schemas/team";
import { useToast } from "@/components/ui/use-toast";

export default function useTeams() {
  const { toast } = useToast();
  const {
    data: teamDatas,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/team", fetcher);

  const createTeam = async (data: TeamCreationSchema) => {
    try {
      await fetch("/api/team", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // # trigger a mutation
      mutate();
    } catch (error: any) {
      console.error("Error updating team data:", error);
      toast({
        title: `Error creating team: ${error.message}`,
      });
    }
  };

  return {
    data: teamDatas,
    error,
    isLoading,
    createTeam,
  };
}

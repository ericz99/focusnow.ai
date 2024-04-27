import { create } from "zustand";

import type { TeamItemIncluded } from "@/prisma/db/team";

export interface TeamStoreState {
  selectedTeam: TeamItemIncluded | null;
  setSelectedTeam: (team: TeamItemIncluded) => void;
}

export const useTeamStore = create<TeamStoreState>()((set) => ({
  selectedTeam: null,
  setSelectedTeam: (team: TeamItemIncluded) =>
    set(() => ({
      selectedTeam: team,
    })),
}));

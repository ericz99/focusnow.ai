import { create } from "zustand";

import type { AssistantItemIncluded } from "@/prisma/db/assistant";

export interface AssistantStoreState {
  selectedAssistant: AssistantItemIncluded | null;
  setSelectedAssistant: (assistant: AssistantItemIncluded) => void;
}

export const useAssistantStore = create<AssistantStoreState>()((set) => ({
  selectedAssistant: null,
  setSelectedAssistant: (assistant: AssistantItemIncluded) =>
    set(() => ({
      selectedAssistant: assistant,
    })),
}));

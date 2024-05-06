import { create } from "zustand";

interface DataStore {
  questions: string[];
  addQuestion: (data: string) => void;
  removeQuestion: () => void;
}

export const useCopilotStore = create<DataStore>()((set) => ({
  questions: [],
  addQuestion: (data: string) =>
    set((state) => ({
      questions: [...state.questions, data],
    })),
  removeQuestion: () =>
    set(() => ({
      questions: [],
    })),
}));

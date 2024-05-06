import { create } from "zustand";

interface DataStore {
  incomingData: string[];
  appendData: (data: string) => void;
  releaseData: () => void;
}

export const useDataStore = create<DataStore>()((set) => ({
  incomingData: [],
  appendData: (data: string) =>
    set((state) => ({
      incomingData: [...state.incomingData, data],
    })),
  releaseData: () =>
    set(() => ({
      incomingData: [],
    })),
}));

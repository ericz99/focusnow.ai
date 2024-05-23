import { create } from "zustand";

interface DataStore {
  incomingData: Blob[];
  appendData: (blob: Blob) => void;
  releaseData: () => void;
}

export const useDataStore = create<DataStore>()((set) => ({
  incomingData: [],
  appendData: (blob: Blob) =>
    set((state) => ({
      incomingData: [...state.incomingData, blob],
    })),
  releaseData: () =>
    set(() => ({
      incomingData: [],
    })),
}));

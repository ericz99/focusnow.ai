import { create } from "zustand";

interface SessionStore {
  isChromeAudioActive: boolean;
  setChromeAudioActive: (isActive: boolean) => void;
}

export const useSessionStore = create<SessionStore>()((set) => ({
  isChromeAudioActive: false,
  setChromeAudioActive: (isActive: boolean) =>
    set(() => ({
      isChromeAudioActive: isActive,
    })),
}));

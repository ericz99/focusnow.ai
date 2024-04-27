import { create } from "zustand";

interface SideBarToggleState {
  isHovered: boolean;
  isClosed: boolean;
  setIsHovered: (hovered: boolean) => void;
  setIsClosed: (closed: boolean) => void;
}

export const useSideBarToggleStore = create<SideBarToggleState>()((set) => ({
  isHovered: false,
  isClosed: false,
  setIsHovered: (hovered: boolean) =>
    set(() => ({
      isHovered: hovered,
    })),

  setIsClosed: (closed: boolean) =>
    set(() => ({
      isClosed: closed,
    })),
}));

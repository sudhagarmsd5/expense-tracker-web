import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

export interface BearState {
  userSession: Session | null;
  setUserUserSession: (supabaseSessionData: Session | null) => void;
  openCloseSideNav: boolean;
  setOpenCloseSideNav: (nav: boolean) => void;
}

export const useZustandStore = create<BearState>((set) => ({
  userSession: null,
  openCloseSideNav: false,
  setUserUserSession: (supabaseSessionData: Session | null) =>
    set((state) => {
      return { ...state, userSession: supabaseSessionData };
    }),
  setOpenCloseSideNav: (nav: boolean) =>
    set((state) => {
      return { ...state, openCloseSideNav: nav };
    }),
}));

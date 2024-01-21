import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

export interface BearState {
  userSession: Session | null ;
  setUserUserSession: (supabaseSessionData: Session | null) => void;
}

export const useZustandStore = create<BearState>((set) => ({
  userSession: null,

  setUserUserSession: (supabaseSessionData: Session|null) =>
    set((state) => {
      return { ...state, userSession: supabaseSessionData };
    }),
}));

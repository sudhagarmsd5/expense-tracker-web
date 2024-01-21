"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./browser-client";
import { useZustandStore } from "../state/zustand";

export default function useSession() {
  const { userSession, setUserUserSession } = useZustandStore();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserUserSession(session);
    };

    getSession();
  }, []);

  return userSession;
}

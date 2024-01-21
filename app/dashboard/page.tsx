"use client";

import React from "react";
import { supabase } from "../lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useZustandStore } from "../lib/state/zustand";

const Dashboard = () => {
  const router = useRouter();
  const { setUserUserSession } = useZustandStore();

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserUserSession(null);
    router.refresh();
  };
  return (
    <div>
      dashboard{" "}
      <div>
        <div>Logged in!</div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </div>
  );
};

export default Dashboard;

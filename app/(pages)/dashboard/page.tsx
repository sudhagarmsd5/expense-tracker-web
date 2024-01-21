"use client";
import { useZustandStore } from "@/app/lib/state/zustand";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const {setUserUserSession } = useZustandStore();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session === null) {
        router.push("/auth");
      } else {
        setUserUserSession(res.data.session);
      }
    });
  }, [supabase]);

  return (
    <div>
      <div>
        <div>Logged in!</div>
      </div>
    </div>
  );
};

export default Dashboard;

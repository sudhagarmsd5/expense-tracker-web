"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import { useZustandStore } from "./lib/state/zustand";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClientComponentClient();
  const { setUserUserSession } = useZustandStore();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session === null) {
        router.push("/auth")
      } else {
        console.log(res.data);        
        setUserUserSession(res.data.session);
        router.push("/dashboard")
      }
    });
  }, [supabase]);

  return (
    <div className={`flex h-screen items-center justify-center bg-white `}>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
    </div>
  );
}

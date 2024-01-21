"use client";
import { useZustandStore } from "./lib/state/zustand";
import { redirect, useRouter } from "next/navigation";
import useSession from "./lib/supabase/use-session";
import { useEffect } from "react";
import AuthForm from "./auth/components/AuthForm";
import Dashboard from "./dashboard/page";

export default function Home() {
  const isAuthenticated = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  // if (isAuthenticated) {
  //   router.push("/dashboard");
  // }

  return isAuthenticated === null ? <AuthForm /> : <Dashboard />;
}

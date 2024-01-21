"use client";
import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const AuthForm = () => {
  const supabase = createClientComponentClient();

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(/bg.svg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/cash-in-hand.png"
              alt="app Logo"
              className=""
              width={100}
              height={24}
              priority
            />
            <div>Expense Tracker</div>
          </div>
          <Auth
            redirectTo={`${window.location.origin}/auth/callback`}
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            onlyThirdPartyProviders={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

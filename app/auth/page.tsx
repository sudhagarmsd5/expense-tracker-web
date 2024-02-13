"use client";
import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
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
          background:"radial-gradient(circle at 0% 0%, rgb(22, 4, 57) 0%, rgb(255, 145, 77) 50%, rgb(9, 0, 84) 100%)"
        }}
      >
        <div>
          <div className="flex flex-col items-center justify-center mb-1">
            <div style={{fontFamily:"cursive",color:"#3D0C02"}} className="text-3xl">Expense Tracker</div>
          </div>
          <Auth
            redirectTo={`${process.env.NEXT_PUBLIC_ORIGIN_URL}/auth/callback`}
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

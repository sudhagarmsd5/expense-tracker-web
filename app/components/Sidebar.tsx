"use client";
import React from "react";
import { useIsGtMd } from "../lib/hooks/useMediaQuery";
import Link from "next/link";
import Image from "next/image";
import { useZustandStore } from "../lib/state/zustand";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { selectAnalyticsData } from "../lib/state/redux/reducer/analytics";
import { useAppSelector } from "../lib/state/redux/store";
import { numberWithCommas } from "../lib/utils/helpers";
import { PiSignOut } from "react-icons/pi";
export const SideBar = () => {
  const isGtMd = useIsGtMd();
  const { userSession, setUserUserSession } = useZustandStore();
  const avatar_url = userSession?.user.user_metadata?.avatar_url;
  const analytics = useAppSelector(selectAnalyticsData).overall_summary;

  const pathName = usePathname();
  const router = useRouter();
  const signOut = async () => {
    router.push("/auth");
    await supabase.auth.signOut();
    setUserUserSession(null);
  };

  //   if (!isGtMd) return <></>;
  return (
    <div className={`${isGtMd ? "sidebar-toggle" : ""}`} id="sidebar-wrapper">
      <div className="sidebar-header h-14 bg-[#f7f7f7]">
        <div
          className="sidebar-header-logo h-full bg-cover bg-center"
          style={{
            backgroundImage: "url(/exp_logo.svg)",
          }}
        ></div>
      </div>

      <div className="relative h-[230px]">
        <div className="profile-image flex justify-center mt-1 pt-10">
          <Image
            src={avatar_url}
            width={500}
            height={500}
            className="w-[80px] h-[80px] rounded-full"
            alt={""}
          />
        </div>
        <div className="text-black text-lg text-center mt-2">
          {userSession?.user.user_metadata.name}
        </div>
        <div className="info wallet-container">
          <span className="balance-align" style={{ height: "27px" }}>
            <Image
              src={"/cash-wallet.svg"}
              width={500}
              height={500}
              className="w-6"
              alt={""}
            />
          </span>
          <span id="current-balance" className="balance-align text-black">
            ₹{numberWithCommas(analytics[0].balance)}
          </span>
        </div>
      </div>

      <div className="relative py-10 ">
        <div className="page-list space-y-5 flex flex-col justify-center items-center">
          <Link
            className={`rounded-full text-center px-7 py-2  ${
              pathName.startsWith("/dashboard") ? "bg-blue-400" : "text-black"
            }`}
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={` rounded-full text-center px-7 py-2 ${
              pathName.startsWith("/transactions")
                ? "bg-blue-400"
                : "text-black"
            }`}
            href="/transactions"
          >
            Transactions
          </Link>
          <button className="text-black text-center" onClick={() => signOut()}>
            <div className="flex items-center">
              <span className="mr-2">
                <PiSignOut />
              </span>{" "}
              Sign out
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

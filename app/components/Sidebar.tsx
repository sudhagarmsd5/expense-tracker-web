"use client";
import React from "react";
import { useIsGtMd } from "../lib/hooks/useMediaQuery";
import Link from "next/link";
import Image from "next/image";
import { useZustandStore } from "../lib/state/zustand";
import { usePathname } from "next/navigation";
export const SideBar = () => {
  const isGtMd = useIsGtMd();
  const { userSession } = useZustandStore();
  const avatar_url = userSession?.user.user_metadata?.avatar_url;
const pathName = usePathname()
  //   if (!isGtMd) return <></>;
  return (
    <div className={`${isGtMd ? "sidebar-toggle" : ""}`} id="sidebar-wrapper">
      <div className="sidebar-header h-14 bg-[#f7f7f7]">
        <div
          className="sidebar-header-logo h-full"
          style={{
            background:
              "url(https://ej2.syncfusion.com/showcase/angular/expensetracker/title.svg) no-repeat center",
          }}
        ></div>
      </div>

      <div className="profile-image flex justify-center mt-1">
        <Image
          src={avatar_url}
          width={500}
          height={500}
          className="w-[80px] h-[80px] rounded-full"
          alt={""}
        />
      </div>

      <div className="py-20 space-y-5 flex flex-col">
        <Link 
        className={`${pathName.startsWith('/dashboard') ? 'bg-blue-400':'text-black'}`} href="/dashboard">
          Dashboard
        </Link>
        <Link 
        className={`${pathName.startsWith('/transactions') ? 'bg-blue-400':'text-black'}`} 
                 href="/transactions">
          Transactions
        </Link>
      </div>
    </div>
  );
};

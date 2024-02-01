import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdSpaceDashboard, MdOutlineListAlt } from "react-icons/md";
import { supabase } from "@/app/lib/supabase";
import { useZustandStore } from "../lib/state/zustand";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { PiSignOut } from "react-icons/pi";
import { numberWithCommas } from "../lib/utils/helpers";
import { selectAnalyticsData } from "../lib/state/redux/reducer/analytics";
import { useAppSelector } from "../lib/state/redux/store";

const Navbar = () => {
  const {
    userSession,
    setUserUserSession,
    openCloseSideNav,
    setOpenCloseSideNav,
  } = useZustandStore();
  const router = useRouter();

  const signOut = async () => {
    router.push("/auth");
    await supabase.auth.signOut();
    setUserUserSession(null);
  };
  const analytics = useAppSelector(selectAnalyticsData).overall_summary;

  const avatar_url = userSession?.user.user_metadata?.avatar_url;

  const menuItems = [
    {
      icon: <MdSpaceDashboard size={25} className="mr-4" />,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <MdOutlineListAlt size={25} className="mr-4" />,
      text: "Transactions",
      path: "/transactions",
    },
  ];

  const pathName = usePathname();
  const navMenuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleOutSideClick, true);

    return () => {
      document.removeEventListener("click", handleOutSideClick, true);
    };
  }, [openCloseSideNav]);

  const handleOutSideClick = (e) => {
    if (!navMenuRef.current.contains(e.target)) {
      if (openCloseSideNav === true) {
        setOpenCloseSideNav(false);
      }
    }
  };

  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 shadow-sm">
      {/* Left side */}
      <div className="flex items-center">
        <div
          onClick={() => setOpenCloseSideNav(true)}
          className="cursor-pointer"
        >
          <AiOutlineMenu size={30} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2">
          <span className="font-bold">Expense Tracker</span>
        </h1>
      </div>

      {/* Cart button */}
      {/* <button className="bg-black text-white hidden md:flex items-center py-2 rounded-full border border-black px-5 ">
        <BsFillCartFill size={20} className="mr-2" /> Cart
      </button> */}

      {/* Mobile Menu */}
      {/* Overlay */}
      {/* {nav ? (
        <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
      ) : (
        ""
      )} */}

      {/* Side drawer menu */}
      <div
        ref={navMenuRef}
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px 0.5px" }}
        className={
          openCloseSideNav
            ? "fixed top-0 left-0 w-[200px] h-screen bg-white z-10 duration-500"
            : "fixed top-0 left-[-100%] w-[200px] h-screen bg-white z-10 duration-500"
        }
      >
        {/* <AiOutlineClose
          onClick={() => setNav((prevNav) => !prevNav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer"
        /> */}
        {/* <Image
          src={avatar_url || "/user.png"}
          alt={"profile image"}
          width={100}
          height={24}
          priority
        />

        {userSession?.user.user_metadata?.name}

        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer"
        />

        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            {menuItems.map(({ icon, text, path }, index) => {
              return (
                <div key={index} className=" py-4">
                  <li className="text-xl flex cursor-pointer mx-auto p-2">
                    {icon}
                    <Link href={path} onClick={() => setNav(!nav)}>
                      {text}
                    </Link>
                  </li>
                </div>
              );
            })}
          </ul>
        </nav>
        <div>
          <button onClick={() => signOut()}>Sign out</button>
        </div> */}
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
            onClick={() => setOpenCloseSideNav(false)}

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
            onClick={() => setOpenCloseSideNav(false)}

            >
              Transactions
            </Link>
            <button
              className="text-black text-center"
              onClick={() => signOut()}
            >
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
    </div>
  );
};

export default Navbar;

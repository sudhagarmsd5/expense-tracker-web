import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdSpaceDashboard, MdOutlineListAlt } from "react-icons/md";
import { supabase } from "@/app/lib/supabase";
import { useZustandStore } from "../lib/state/zustand";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const { userSession, setUserUserSession } = useZustandStore();
  const router = useRouter();

  const signOut = async () => {
    router.push("/auth");
    await supabase.auth.signOut();
    setUserUserSession(null);
  };

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
  return (
    <div className="max-w-[1640px] mx-auto flex justify-between items-center p-4 shadow-sm">
      {/* Left side */}
      <div className="flex items-center">
        <div onClick={() => setNav(!nav)} className="cursor-pointer">
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
      {nav ? (
        <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
      ) : (
        ""
      )}

      {/* Side drawer menu */}
      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-500"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-500"
        }
      >
        <Image
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;

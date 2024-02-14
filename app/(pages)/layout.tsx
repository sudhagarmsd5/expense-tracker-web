"use client";
import Navbar from "@/app/components/Navbar";
import ReduxProvider from "../reduxProvider";
import { useIsLtMd, useIsGtMd } from "../lib/hooks/useMediaQuery";
import { SideBar } from "../components/Sidebar";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLtMd = useIsLtMd();
  const isGtMd = useIsGtMd();

  return (
    <main className="bg-gray-200 h-full">
      <ReduxProvider>
        {isLtMd === true ? <Navbar /> : <></>}
        {isGtMd === true ? <SideBar /> : <></>}
        {children}
      </ReduxProvider>
    </main>
  );
}

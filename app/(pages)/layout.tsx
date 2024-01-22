"use client";
import Navbar from "@/app/components/Navbar";
import ReduxProvider from "../reduxProvider";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <ReduxProvider>
      <Navbar />
      {children}
      </ReduxProvider>
    </main>
  );
}

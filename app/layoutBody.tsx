"use client";
import "./globals.css";
import React from "react";
import Loading from "../components/loading";
import NavBar from "../components/navBar";
import UserMenu from "../components/userMenu";
import { usePathname } from "next/navigation";

export default function LayoutBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === "/auth") {
    return <main className="p-10">{children}</main>;
  } else {
    return (
      <div className="flex flex-row static" id="root">
        {/* Nav bar */}
        <div className="bg-main text-white justify-between sticky top-0 z-100 h-lvh flex flex-col items-center border-b">
          <NavBar />
        </div>

        {/* Header pfp */}
        <div className="flex-grow">
          <div className="flex flex-column justify-end p-4 sticky top-0 bg-white z-100">
            <UserMenu></UserMenu>
          </div>
          {/* Page component */}
          <main className="z-0 p-6 pl-12 flex flex-col flex-grow items-center justify-center">
            <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
          </main>
        </div>
      </div>
    );
  }
}

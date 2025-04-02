
import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import React from "react";
import Loading from "@/components/loading";
import NavBar from "@/components/navBar";

export const metadata: Metadata = {
  title: "Shopalizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="flex flex-row static">
        {/* Nav bar */}
        <div className="bg-main text-white justify-between sticky top-0 z-100 h-lvh flex flex-col items-center" >
          <NavBar />
        </div>
        
        {/* Header pfp */}
        <div className="flex-grow">
          <div className="flex flex-column justify-end p-4 sticky top-0 bg-white z-10">
            <Image
              className="rounded-full"
              src="/user.jpg"
              alt="User pfp"
              width={60}
              height={70}
            />
          </div>
          {/* Page component */}
          <main className="z-0 p-6 pl-12">
            <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}

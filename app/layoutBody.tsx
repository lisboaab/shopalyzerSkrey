"use client";
import "./globals.css";
import React from "react";
import Loading from "../components/loading";
import NavBar from "../components/navBar";
import UserMenu from "../components/userMenu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LayoutBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
 
  // o objetivo desse useEffect era fazer com que a navbar e o loading não aparecessem enquanto a página vê se tem um token no localStorage
  // mas não funciona. O ideal seria colocar a página de login como principal e se tiver um token ele envia pra outra?
  useEffect(() => {
    const t = localStorage.getItem("authToken");
    if (t) {
      setToken(t); 
      setLoading(false)
      return
    } else {
      router.push("/"); 
      setLoading(false)
      return
    }
    
  }, []);



  if(loading){
    return <Loading />
  } else {
    if (pathname === "/" || pathname === "/auth") {
      return <main className="w-full h-lvh">{children}</main>;
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
            <main className="z-0 p-6 pl-12 flex flex-col flex-grow items-center justify-center w-full 
            ">
              {/* h-[calc(100vh-100px)] */}
              <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
            </main>
          </div>
        </div>
      );
    }
  }
}

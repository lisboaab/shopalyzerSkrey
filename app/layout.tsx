import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import LayoutBody from "./layoutBody";

export const metadata: Metadata = {
  title: "Shopalyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
      <html>
        <body>
          <LayoutBody children={children}/>
        </body>
      </html>
    );
  
}

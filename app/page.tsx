"use client";

import SignUpForm from "@/components/forms/signup";
import SignInForm from "@/components/forms/signin";
import { useState } from "react";
import Image from 'next/image';
import loginBG from '@/public/loginBG.svg';
import skreyBG from '@/public/skreyBG.svg';

export default function Page() {
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <div className="p-10 w-full h-full flex flex-row items-center justify-center">
      
      {/* Formulários sempre visíveis lado a lado */}
      <div className="relative flex w-full h-full rounded-2xl overflow-hidden">
        {/* Sign Up */}
        <div className="flex flex-col gap-4 justify-center items-center basis-3/2 bg-white z-10 px-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl worksans-semibold text-center">Let’s <span className="main">get started</span></h1>
            <p className="gellix text-center ">Data analysis becomes simpler past this point!</p>
          </div>
          <SignUpForm />
          <p className="text-sm mt-4 gellix text-center">
            Already have an account?{" "}
            <button
              onClick={() => setIsSignIn(false)}
              className="main hover:underline gellix"
            >
              Sign In
            </button>
          </p>
        </div>
        {/* Sign In */}
        <div className="flex flex-col gap-4 justify-center items-center basis-5/3 bg-white z-10 px-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl worksans-semibold text-center"><span className="main">Welcome</span> back</h1>
            <p className="gellix text-center ">Start analyzing data today!</p>
          </div>
          <SignInForm />
          <p className="text-sm mt-4 gellix text-center">
            Dont have an account?{" "}
            <button
              onClick={() => setIsSignIn(true)}
              className="main hover:underline gellix"
            >
              Sign Up
            </button>
          </p>
        </div>
        {/* Overlay com animação */}
        <div
          className={`
            absolute top-0 left-0 h-full w-1/2 z-20 transition-transform duration-700 ease-in-out
            ${isSignIn ? "translate-x-full" : "translate-x-0"}
            pointer-events-none
          `}
        >
          <Image
            src={skreyBG}
            alt="Skrey BG"
            fill
            className="rounded-2xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}

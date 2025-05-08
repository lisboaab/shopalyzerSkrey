"use client";

import SignUpForm from "@/components/forms/signup";
import SignInForm from "@/components/forms/signin";
import { useState } from "react";
import Image from 'next/image';
import loginBG from '@/public/loginBG.svg'
import skreyBG from '@/public/skreyBG.svg'

export default function Page() {
  const [isSignIn, setIsSignIn] = useState(false);

  const handleSignIn = (value: string) => {
    const e = document.getElementById("mainDiv")
    if(e) {
      if(value === "true"){
        e.classList.remove("flex-row")
        e.classList.add("flex-row-reverse")
        setIsSignIn(true)
      }
      else {
        e.classList.remove("flex-row-reverse")
        e.classList.add("flex-row")
        setIsSignIn(false)
      }
    }
  }
  return (
    <div id="mainDiv" className="p-10 w-full h-full flex flex-row items-center bg-gray-100 justify-center">
      <div className="flex justify-center h-full items-center basis-xl">
        <Image
          priority
          src={skreyBG}
          alt="Skrey BG"
          className="w-full"
        />
      </div>
      <div className="justify-center basis-5xl">
        {isSignIn ? (
        <div className="flex flex-col gap-4 justify-self-center w-fit">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl worksans-semibold text-center">Let’s <span className="main">get started</span></h1>
            <p className="gellix text-center ">Data analysis becomes simpler past this point!</p>
          </div>
          <SignUpForm />
          <p className="text-sm mt-4 gellix text-center">
            Already have an account?{" "}
            <button
              onClick={() => handleSignIn("false")}
              className="main hover:underline gellix"
            >
              Sign In
            </button>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 justify-self-center w-fit">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl worksans-semibold text-center"><span className="main">Welcome</span> back</h1>
            <p className="gellix text-center ">Start analyzing data today!</p>
          </div>
          <SignInForm />
          <p className="text-sm mt-4 gellix text-center">
            Dont have an account?{" "}
            <button
              onClick={() => handleSignIn("true")}
              className="main hover:underline gellix"
            >
              Sign Up
            </button>
          </p>
          </div>
        )}
      </div>
    </div>
  );
}

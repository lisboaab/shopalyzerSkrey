"use client";

import SignUpForm from "@/components/forms/signup";
import SignInForm from "@/components/forms/signin";
import { useState } from "react";

export default function Page() {
  const [isSignIn, setIsSignIn] = useState(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div>
        {isSignIn ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          <SignUpForm />
          <p className="text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={() => setIsSignIn(false)}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Sign In</h1>
          <SignInForm />
          <p className="text-sm mt-4">
            Dont have an account?{" "}
            <button
              onClick={() => setIsSignIn(true)}
              className="text-blue-500 hover:underline"
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

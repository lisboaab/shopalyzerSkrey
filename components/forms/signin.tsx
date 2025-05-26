"use client";
import { useState } from "react";
import { loginUser } from "@/lib/queries";
import { useRouter } from "next/navigation";
import ButtonAnimation from "@/components/buttonAnimation";

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailInput = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;    const passwordInput = document.getElementById(
      "passwordInput"
    )?.parentElement as HTMLElement;

    try {
      const input = {
        email,
        password,
      };
      if (!email || !password) {
        setError("All fields required.");
        if (!email) emailInput.classList.add("border-red-500");
        else if (!password) passwordInput.classList.add("border-red-500");
        return;
      }
      const data = await loginUser(input);

      if (data?.loginUser.userID) {
        // localStorage.setItem("authToken", data.loginUser.accessToken);
        // localStorage.setItem("userID", data.loginUser.userID);
        router.push("/new");
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error);
        console.log("Login error:", error)
         console.log("Login error message:", error.message)
        if (error.message === "User not found") {
          emailInput.classList.add("border-red-500");
          passwordInput.classList.remove("border-red-500");
          setError("Please, enter a valid email address.");
        }
        if (error.message === "Wrong password") {
          emailInput.classList.remove("border-red-500");
          passwordInput.classList.add("border-red-500");
          setError("Wrong password. Please, try again.");
        } 
        
      }
      else {
          setError("An error occurred. Please try again.");
        }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col gap-4 min-w-80 py-5 gellix background-color-none"
      >
        <div className="flex flex-col gap-2">
          <p className="gellix">Email</p>
          <input
            id="emailInput"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg gellix bg-transparent outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="gellix">Password</p>
          <label className="flex flex-row items-center border border-gray-300 text-gray-900 text-sm rounded-lg p-3 gellix justify-between">
            <input
              id="passwordInput"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gellix w-full bg-transparent outline-none"
            />
            {showPassword ? (
              <svg
                onClick={() => setShowPassword(false)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="gray"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            ) : (
              <svg
                onClick={() => setShowPassword(true)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="gray"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            )}
          </label>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <ButtonAnimation
          label="Log in"
          type="submit"
          color="blue"
          style="outline"
          icon="arrow"
        />
      </form>
    </div>
  );
};

export default SignInForm;

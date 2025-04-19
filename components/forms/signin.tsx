"use client";
import { useState } from "react";
import { loginUser } from "@/lib/queries";
import { useRouter } from "next/navigation";


const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailInput = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;

    try {
      const input = {
        email,
        password,
      };
      if(!email || !password) {
        setError("All fields required.");
        if(!email) emailInput.classList.add("border-red-500");
        if(!password) passwordInput.classList.add("border-red-500");
        return;
      }
      const data = await loginUser(input);

      if (data?.loginUser.userID) {
        localStorage.setItem("authToken", data.loginUser.accessToken);
        localStorage.setItem("userID", data.loginUser.userID);
        router.push("/");
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error);
        if (error.message === "User not found") {
          emailInput.classList.add("border-red-500");
          setError("Please, enter a valid email address.");
        }
        if (error.message === "Wrong password") {
          passwordInput.classList.add("border-red-500");
          setError("Wrong password. Please, try again.");
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <input
          id="emailInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          id="passwordInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default SignInForm;

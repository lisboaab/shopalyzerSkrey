"use client";
import { useState } from "react";
import { createUser } from "@/lib/queries";
import { loginUser } from "@/lib/queries";
import { useRouter } from "next/navigation";

const SignUpForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nameInput = document.getElementById(
      "nameInput"
    ) as HTMLInputElement;
    const emailInput = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "confirmPasswordInput"
    ) as HTMLInputElement;

    try {
      const input = {
        name,
        email,
        password,
      };

      if (!name || !email || !password || !confirmPassword) {
        setError("All fields required.");
        if (!name) nameInput.classList.add("border-red-500");
        if (!email) emailInput.classList.add("border-red-500");
        if (!password) passwordInput.classList.add("border-red-500");
        if (!confirmPassword)
          confirmPasswordInput.classList.add("border-red-500");
        return;
      }

      if (password !== confirmPassword) {
        passwordInput.classList.add("border-red-500");
        confirmPasswordInput.classList.add("border-red-500");
        setError("Passwords do not match.");
        return;
      }

      const data = await createUser(input);

      if (data?.createUser) {
        const loginInput = {
          email,
          password,
        };
        const login = await loginUser(loginInput);

        if (login) {
          localStorage.setItem("authToken", login.loginUser.accessToken);
          localStorage.setItem("userID", login.loginUser.userID);
          router.push("/");
        }
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        if (error.message === "This email is already in use.") {
          emailInput.classList.add("border-red-500");
          setError("This email is already in use.");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <input
        id="nameInput"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
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
      <input
        id="confirmPasswordInput"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;

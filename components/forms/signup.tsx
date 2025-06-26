"use client";
import { useState } from "react";
import { createUser } from "@/lib/queries";
import { loginUser } from "@/lib/queries";
import { useRouter } from "next/navigation";
import ButtonAnimation from "@/components/buttonAnimation";

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

    const nameInput = document.getElementById("nameInput") as HTMLInputElement;
    const signUpEmailInput = document.getElementById(
      "signUpEmailInput"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "confirmPasswordInput"
    ) as HTMLInputElement;

    nameInput.classList.remove("border-red-500");
    signUpEmailInput.classList.remove("border-red-500");
    passwordInput.classList.remove("border-red-500");
    confirmPasswordInput.classList.remove("border-red-500");

    try {
      const input = {
        name,
        email,
        password,
      };

      if (!name || !email || !password || !confirmPassword) {
        setError("All fields required.");
        if (!name) nameInput.classList.add("border-red-500");
        if (!email) signUpEmailInput.classList.add("border-red-500");
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
          router.push("/new");
        }
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        if (error.message === "This email is already in use.") {
          signUpEmailInput.classList.add("border-red-500");
          setError("This email is already in use.");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-6 min-w-80 py-5">
      <div className="flex flex-col gap-2">
        <p className="gellix">Name</p>
        <input
          id="nameInput"
          type="text"
          placeholder="Enter your first name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            e.currentTarget.classList.remove("border-red-500");
          }}
          className="border border-gray-300 p-2 rounded-lg gellix bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSignUp(e);
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="gellix">Email</p>
        <input
          id="signUpEmailInput"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            e.currentTarget.classList.remove("border-red-500");
          }}
          className="border border-gray-300 p-2 rounded-lg gellix bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSignUp(e);
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="gellix">Password</p>
        <input
          id="passwordInput"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            e.currentTarget.classList.remove("border-red-500");
          }}
          className="border border-gray-300 p-2 rounded-lg gellix bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSignUp(e);
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="gellix">Confirm Password</p>
        <input
          id="confirmPasswordInput"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            e.currentTarget.classList.remove("border-red-500");
          }}
          className="border border-gray-300 p-2 rounded-lg gellix bg-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSignUp(e);
            }
          }}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ButtonAnimation
        label="Sign up"
        type="submit"
        color="blue"
        style="outline"
        icon="arrow"
      />
    </form>
  );
};

export default SignUpForm;

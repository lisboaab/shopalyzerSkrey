"use client";
import React, { useState, useEffect, Suspense } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import "../app/globals.css";

import { getUser, updateUser } from "@/lib/queries";

import ModalUserMenu from "./modal/modalUserMenu";
import ModalProfile from "./modal/modalProfile";
import SnackBar from "./modal/snackBar";
import ButtonAnimation from "./buttonAnimation";
import Loading from "./loading";

const UserMenu: React.FC = () => {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [isClient, setIsClient] = useState(false);

  const [password, setPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const [userState, setUserState] = useState({
    token: "",
    userId: "",
    profilePhoto: "",
    name: "",
    email: "",
    hashPassword: "",
    userType: "",
  });

  const updateUserState = (key: string, value: string) => {
    setUserState((prev) => ({ ...prev, [key]: value }));
  };

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarType, setSnackBarType] = useState("success");
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const fetchUser = async (ID: string) => {
    try {
      const user = await getUser(ID);
      if (user) {
        updateUserState("profilePhoto", user.profilePicture);
        updateUserState("name", user.name);
        updateUserState("email", user.email);
        updateUserState("password", user.password);
        updateUserState("userType", user.userType);
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("authToken");
      const id = localStorage.getItem("userID");
      if (t && id) {
        updateUserState("token", t);
        updateUserState("userId", id);
      } else {
        router.push("/");
      }
    }
  }, []);

  useEffect(() => {
    if (!userState.userId) return;
    fetchUser(userState.userId);
  }, [userState.userId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }
  const modalHanlder = (modal: string) => {
    setNameInput(false);
    setEmailInput(false);
    setPasswordInput(false);
    if (modal == "menu") setShowModal((curr) => !curr);
    else setShowProfileModal((curr) => !curr);
  };

  const handleSnackBar = (type: string, title: string) => {
    setSnackBarType(
      type === "failurePassword" ? "error" : type === "failure" ? "error" : type
    );
    setSnackBarMessage(title);
    setSnackBarOpen(true);
    setTimeout(() => {
      setSnackBarOpen(false);
    }, 3000);
  };

  const goToSavedSearches = () => {
    if (router) {
      modalHanlder("menu");
      router.push("/saved");
    }
  };

  const goToAdminPanel = () => {
    if (router) {
      modalHanlder("menu");
      router.push("/admin");
    }
  };

  const displayProfileModal = () => {
    if (router) {
      modalHanlder("menu");
      modalHanlder("profile");
    }
  };

  const editUserPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    updateUserState("profilePhoto", previewUrl);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const data = await updateUser(userState.userId, {
          profilePicture: base64String,
        });

        if (data.profilePicture) {
          updateUserState("profilePhoto", data.profilePicture);
          handleSnackBar("success", "Profile photo updated successfully!");
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
        handleSnackBar("failure", "Failed to upload photo.");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userID");
    router.push("/");
  };

  const handleSave = async (input: string) => {
    if (input === "name") {
      setNameInput(false);

      if (!userState.userId) {
        console.error("User ID is missing");
        return;
      }

      if (!userState.name) {
        fetchUser(userState.userId);
        handleSnackBar("failure", "Name is required!");
        return;
      }

      try {
        const updatedUser = await updateUser(userState.userId, {
          name: userState.name,
        });
        handleSnackBar("success", "Name updated successfully!");
      } catch (error) {
        handleSnackBar("failure", "Something went wrong, try again!");
        fetchUser(userState.userId);
        console.error("Error updating user:", error);
      }
    }
    if (input === "email") {
      setEmailInput(false);

      if (!userState.userId) {
        console.error("User ID is missing");
        return;
      }

      try {
        const updatedUser = await updateUser(userState.userId, {
          email: userState.email,
        });
        if (updatedUser)
          handleSnackBar("success", "Profile updated successfully!");
      } catch (error) {
        fetchUser(userState.userId);
        console.error("Error updating user:", error);
        handleSnackBar("failure", "That email address is already in use.");
      }
    }
    if (input === "password") {
      setPasswordInput(false);

      if (!userState.userId) {
        console.error("User ID is missing");
        return;
      }

      const check = bcrypt.compareSync(password, userState.hashPassword);
      if (!check) {
        handleSnackBar("failurePassword", "Old password is incorrect!");
        return;
      }

      if (!newPassword) {
        handleSnackBar("failure", "New password is required!");
        return;
      }
      if (newPassword === password) {
        handleSnackBar("failure", "New password must be different!");
        return;
      }
      try {
        const updatedUser = await updateUser(userState.userId, {
          password: newPassword,
        });
        handleSnackBar("success", "Password updated successfully!");
        setNewPassword("");
      } catch (error) {
        fetchUser(userState.userId);
        console.error("Error updating user:", error);
        handleSnackBar("failure", "Error updating password!");
      }
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      {userState.token && (
        <div>
          <div className="flex flex-row justify-center items-center size-17 rounded-full bg-linear-55 from-blue-600 from-20% to-blue-50">
            {userState.profilePhoto ? (
              <div className="rounded-ful flex items-center justify-center h-15 w-15 cursor-pointer">
                <img
                  src={userState.profilePhoto}
                  alt="Your profile picture"
                  className="rounded-full w-contain h-contain"
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                  onClick={() => modalHanlder("menu")}
                />
              </div>
            ) : (
              <div
                className="rounded-full bg-grey50 cursor-pointer w-contain h-contain w-fit h-fit p-3 px-5 text-3xl flex items-center justify-center worksans-medium main"
                onClick={() => modalHanlder("menu")}
              >
                {userState.name ? userState.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}

            <ModalUserMenu
              isOpen={showModal}
              onDismiss={() => modalHanlder("menu")}
            >
              <div className="flex flex-col justify-start">
                {/* profile */}
                <h1
                  className="text-black hover:bg-gray-100 hover:rounded-lg p-3 flex flex-row gap-4 items-center cursor-pointer"
                  onClick={displayProfileModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  Profile
                </h1>
                {/* Saved */}
                <h1
                  className="text-black hover:bg-gray-100 hover:rounded-lg p-3 flex flex-row gap-4 items-center cursor-pointer"
                  onClick={goToSavedSearches}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                  Saved searches
                </h1>
                {/* ADMIN Panel */}
                {userState.userType === "admin" && (
                  <h1
                    className="text-black hover:bg-gray-100 hover:rounded-lg p-3 flex flex-row gap-4 items-center cursor-pointer"
                    onClick={goToAdminPanel}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    ADMIN Panel
                  </h1>
                )}
                {/* Log out */}
                <h1
                  className="text-black hover:bg-gray-100 hover:rounded-lg p-3 flex flex-row gap-4 items-center border-t border-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Log out
                </h1>
              </div>
            </ModalUserMenu>
            <ModalProfile
              isOpen={showProfileModal}
              onDismiss={() => modalHanlder("profile")}
              title={"Your profile"}
            >
              <div className="flex flex-row items-center justify-between">
                {/* profile picture */}
                <div className="flex flex-col w-1/3 gap-4 items-center">
                  <div className="flex flex-row justify-center items-center size-45 rounded-full bg-linear-55 from-blue-600 from-20% to-blue-50">
                    {userState.profilePhoto ? (
                      <div className="rounded-ful flex items-center justify-center h-42 w-42">
                        <img
                          src={userState.profilePhoto}
                          alt="Your profile picture"
                          className="rounded-full w-contain h-contain"
                          style={{
                            objectFit: "cover",
                            height: "100%",
                            width: "100%",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="rounded-full bg-grey50 cursor-pointer w-contain h-contain w-fit h-fit p-8 px-12 text-8xl flex items-center justify-center worksans-medium main">
                        {userState.name
                          ? userState.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                  <ButtonAnimation
                    icon="pencil"
                    style="outline"
                    color="#414653"
                    label="Edit"
                    width="9em"
                    action={() =>
                      document.getElementById("photoInput")?.click()
                    }
                  />
                  <input
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={editUserPhoto}
                  />
                </div>

                {/* user information */}
                <div className="flex flex-col w-2/3 items-center justify-center gap-4 pl-10">
                  {/* name */}
                  <div className="flex flex-row items-start justify-between w-full h-full">
                    {!nameInput && (
                      <div
                        id="name"
                        className="flex flex-row gap-5 items-center"
                      >
                        <div className="flex flex-row gap-4 items-center">
                          <h1>Name:</h1>
                          <h1 className="gellix-semibold">{userState.name}</h1>
                        </div>
                        {/* edit button */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#0D0DFC"
                          className="size-5 cursor-pointer"
                          onClick={() => setNameInput((curr) => !curr)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </div>
                    )}
                    {/* name input */}
                    {nameInput && (
                      <div
                        id="nameInput"
                        className="flex flex-row gap-5 items-center justify-between"
                      >
                        <div className="flex flex-row gap-4 items-center">
                          <h1>Name:</h1>
                          <input
                            type="text"
                            className="border border-gray-200 text-gray-900 text-sm rounded-lg w-56 p-3 gellix outline-none"
                            value={userState.name}
                            onChange={(e) =>
                              updateUserState("name", e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSave("name");
                              }
                            }}
                          ></input>
                        </div>
                        {/* edit button */}
                        <div className="flex flex-row gap-2 items-center cursor-pointer">
                          <div className=" hover:bg-gray-100 hover:rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="#DE1B1B"
                              className="size-5 "
                              onClick={() => setNameInput(false)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                          </div>

                          <div className=" hover:bg-gray-100 hover:rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="green"
                              className="size-5"
                              onClick={() => handleSave("name")}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* email */}
                  <div className="flex flex-row items-start justify-between w-full h-full">
                    {!emailInput && (
                      <div
                        id="name"
                        className="flex flex-row gap-5 items-center"
                      >
                        <div className="flex flex-row gap-4 items-center">
                          <h1>Email:</h1>
                          <h1 className="gellix-semibold">{userState.email}</h1>
                        </div>
                        {/* edit button */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#0D0DFC"
                          className="size-5 cursor-pointer"
                          onClick={() => setEmailInput((curr) => !curr)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </div>
                    )}
                    {/* email input */}
                    {emailInput && (
                      <div
                        id="nameInput"
                        className="flex flex-row gap-5 items-center justify-between"
                      >
                        <div className="flex flex-row gap-4 items-center">
                          <h1>Email:</h1>
                          <div className="flex flex-col gap-2">
                            <input
                              id="email"
                              type="text"
                              className="border border-gray-200 text-gray-900 text-sm rounded-lg w-56 p-3 gellix outline-none"
                              value={userState.email}
                              onChange={(e) =>
                                updateUserState("email", e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSave("email");
                                }
                              }}
                            ></input>
                          </div>
                        </div>
                        {/* edit button */}
                        <div className="flex flex-row gap-2 items-center cursor-pointer">
                          <div className=" hover:bg-gray-100 hover:rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="#DE1B1B"
                              className="size-5 "
                              onClick={() => setEmailInput(false)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                          </div>

                          <div className=" hover:bg-gray-100 hover:rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="green"
                              className="size-5"
                              onClick={() => handleSave("email")}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* password */}
                  <div className="flex flex-row items-start justify-between w-full h-full">
                    {!passwordInput && (
                      <div
                        id="password"
                        className="flex flex-row w-full items-center gap-5"
                      >
                        <h1>Password</h1>

                        {/* edit button */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#0D0DFC"
                          className="size-5 cursor-pointer"
                          onClick={() => setPasswordInput((curr) => !curr)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </div>
                    )}
                    {/* password input */}
                    {passwordInput && (
                      <div
                        id="nameInput"
                        className="flex flex-row gap-5 items-end justify-between"
                      >
                        <div className="flex flex-row gap-2 items-start">
                          <h1>Password:</h1>
                          <div className="flex flex-col gap-2">
                            <input
                              id="oldPassword"
                              type="password"
                              className="border border-gray-200 text-gray-900 text-sm rounded-lg w-56 p-3 gellix outline-none"
                              placeholder="Old passowrd"
                              onChange={(e) => setPassword(e.target.value)}
                            ></input>
                            <input
                              id="newPassword"
                              type="password"
                              className="border border-gray-200 text-gray-900 text-sm rounded-lg w-56 p-3 gellix outline-none"
                              placeholder="New passowrd"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSave("password");
                                }
                              }}
                            ></input>
                          </div>
                        </div>
                        {/* edit button */}
                        <div className="flex flex-row gap-2 items-center cursor-pointer">
                          <div className=" hover:bg-gray-100 hover:rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="#DE1B1B"
                              className="size-5 "
                              onClick={() => setPasswordInput(false)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                          </div>

                          <div className=" hover:bg-gray-100 hover:rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="green"
                              className="size-5"
                              onClick={() => handleSave("password")}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ModalProfile>
            <SnackBar
              type={snackBarType}
              isOpen={snackBarOpen}
              title={snackBarMessage}
              onDismiss={() => setSnackBarOpen(false)}
            ></SnackBar>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default UserMenu;

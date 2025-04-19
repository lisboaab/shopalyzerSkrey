// UserMenu.jsx
"use client";
import React, { useState, useEffect } from "react";
import "../app/globals.css";
import ModalUserMenu from "./modal/modalUserMenu";
import { useRouter } from "next/navigation";
import ModalProfile from "./modal/modalProfile";
import { getUser, updateUser } from "@/lib/queries";
import SnackBar from "./modal/snackBar";
import ProfileContent from "./user/profileContent";

const UserMenu = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    profilePicture: "/user.jpg",
    password: "",
    userType: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userID");

    if (!token || !userId) {
      window.location.href = "/auth";
      return;
    }

    setUserData((prev) => ({ ...prev, id: userId }));
    fetchUser(userId);
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const user = await getUser(userId);
      if (user) {
        setUserData({
          id: userId,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          password: user.password,
          userType: user.userType,
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      showNotification("failure", "Failed to load user data");
    }
  };

  const toggleModal = (modal: any) => {
    if (modal === "menu") {
      setShowModal((prev) => !prev);
    } else {
      setShowProfileModal((prev) => !prev);
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({
      open: true,
      type:
        type === "failurePassword"
          ? "error"
          : type === "failure"
          ? "error"
          : type,
      message,
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleUpdateUser = async (updates: any) => {
    if (!userData.id) {
      console.error("User ID is missing");
      return Promise.reject(new Error("User ID is missing"));
    }

    try {
      return await updateUser(userData.id, updates);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const displayProfile = () => {
    toggleModal("menu");
    toggleModal("profile");
  };

  const navigateTo = (path: string) => {
    toggleModal("menu");
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userID");
    window.location.href = "/auth";
  };

  if (!userData.id) return null;

  return (
    <div>
      <div className="flex flex-row justify-center items-center size-17 rounded-full bg-linear-55 from-blue-600 from-20% to-blue-50">
        <div className="rounded-ful flex items-center justify-center h-15 w-15 cursor-pointer">
          <img
            src={userData.profilePicture}
            alt="Your profile picture"
            className="rounded-full w-contain h-contain"
            style={{ objectFit: "cover", height: "100%", width: "100%" }}
            onClick={() => toggleModal("menu")}
          />
        </div>

        <ModalUserMenu isOpen={showModal} onDismiss={() => toggleModal("menu")}>
          <div className="flex flex-col justify-start">
            {/* Profile */}
            <h1
              className="text-black hover:bg-gray-100 hover:rounded-lg p-3 flex flex-row gap-4 items-center cursor-pointer"
              onClick={displayProfile}
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
              onClick={() => navigateTo("/saved")}
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

            {/* ADMIN Panel - conditional rendering */}
            {userData.userType === "admin" && (
              <h1
                className="text-black hover:bg-gray-100 hover:rounded-lg p-3 flex flex-row gap-4 items-center cursor-pointer"
                onClick={() => navigateTo("/admin")}
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
          onDismiss={() => toggleModal("profile")}
          title={"Your profile"}
        >
          <ProfileContent
            user={userData}
            onUpdateUser={handleUpdateUser}
            onNotification={showNotification}
          />
        </ModalProfile>

        <SnackBar
          type={notification.type}
          isOpen={notification.open}
          title={notification.message}
          onDismiss={() =>
            setNotification((prev) => ({ ...prev, open: false }))
          }
        />
      </div>
    </div>
  );
};

export default UserMenu;

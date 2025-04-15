import { create } from "zustand";
import User from "../interface/user";
import { createUser, loginUser } from "../../lib/queries";

export type UserState = {
  loggedUserInfo: {
    id: string;
    name: string;
    email: string;
    password: string;
    userType: string;
    profilePicture: string;
    cloudinaryId: string;
    notifications: boolean;
  };
};

export type UserActions = {
  login: (username: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
};

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  loggedUserInfo: {
    id: "",
    name: "",
    email: "",
    password: "",
    userType: "",
    profilePicture: "",
    cloudinaryId: "",
    notifications: false,
  },
  login: async (email, password) => {
    const input = {
      email: email,
      password: password,
    };
    const response = await loginUser(input);
    set({
      loggedUserInfo: { ...response.userInfo },
    });
    localStorage.setItem("authToken", response.accessToken);
    localStorage.setItem("userID", response.userID);
  },
  signup: async (name, email, password) => {
    const input = {
      name: name,
      email: email,
      password: password,
    };
    const response = await createUser(input);
    await useUserStore.getState().login(email, password);
  },
}));

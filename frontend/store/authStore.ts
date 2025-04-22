"use client";

import { create } from "zustand";

type User = {
  id: string;
  username: string;
  createdAt: string;
};

type AuthStore = {
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  login: (payload: { token: string; tokenExpires: string; user: User }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  expiresAt: null,
  login: ({ token, tokenExpires, user }) => {
    localStorage.setItem("token", token);
    set({ token, expiresAt: tokenExpires, user });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, expiresAt: null });
  },
}));

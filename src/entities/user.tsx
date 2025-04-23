import { startTransition } from "react";
import { create } from "zustand";
import { fetchUsers, User } from "../Shared/api";

type UserState = {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
};

export const useUsersGlobal = create<UserState>((set) => ({
  usersPromise: fetchUsers(),
  refetchUsers: () =>
    startTransition(() => set({ usersPromise: fetchUsers() })),
}));

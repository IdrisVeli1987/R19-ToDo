import { useState, startTransition } from "react";
import { fetchUsers } from "../../Shared/api";
import { createUserAction, deleteUserAction } from "./actions";

const defaultUsersPromise = fetchUsers();

export function useUsers() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return {
    createUserAction: createUserAction({ refetchUsers }),
    deleteUserAction: deleteUserAction({ refetchUsers }),
    usersPromise,
  } as const;
}

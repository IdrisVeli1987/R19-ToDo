import { use, useOptimistic } from "react";
import { User } from "../../Shared/api";
import { createUserAction, deleteUserAction } from "./actions";
import { useUsersGlobal } from "../../entities/user";

// const defaultUsersPromise = fetchUsers();

export function useUsers() {
  const {refetchUsers, usersPromise} = useUsersGlobal();

  const [createdUsers, optimisticCreate] = useOptimistic(
    [] as User[],
    (createdUsers, user: User) => [...createdUsers, user]
  );

  const [deletedUsersIds, optimisticDelete] = useOptimistic(
    [] as string[],
    (deleteUsers, id: string) => deleteUsers.concat(id)
  );

  const useUsersList = () => {
    const users = use(usersPromise);

    return users
      .concat(createdUsers)
      .filter((user) => !deletedUsersIds.includes(user.id));
  };

  return {
    createUserAction: createUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
    useUsersList,
  } as const;
}

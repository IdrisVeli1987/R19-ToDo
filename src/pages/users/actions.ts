import { createUser, deleteUser } from "../../Shared/api";

// CREATE USER

type CreateActionState = {
  email: string;
  error?: string;
};

export type CreateUserAction = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function createUserAction({
  refetchUsers,
}: {
  refetchUsers: () => void;
}): CreateUserAction {
  return async (_, formData) => {
    const email = formData.get("email") as string;
    if (email === "admin@gmail.com") {
      return {
        email,
        error: "Admin account is not allowed",
      };
    }

    try {
      await createUser({
        email,
        id: crypto.randomUUID(),
      });
      refetchUsers();
      return {
        email: "",
      };
    } catch {
      return {
        email,
        error: "Error while creating user",
      };
    }
  };
}

// Action-асинхронная ф-ия, к-я делает переходы, ф-ия для transition

// --------------------------------------------------------------------------

// DELETE USER

type DeleteUserActionState = {
  error?: string;
};

export type DeleteUserAction = (
  state: DeleteUserActionState,
  formData: FormData
) => Promise<DeleteUserActionState>;

export function deleteUserAction({
  refetchUsers,
}: {
  refetchUsers: () => void;
}): DeleteUserAction {
  return async (
    _,
    formData
  ) => {
    const id = formData.get("id") as string;
    await deleteUser(id);
    try {
      await deleteUser(id);
      refetchUsers();
      return {};
    } catch {
      return {
        error: "Error while deleting user",
      };
    }
  };
}

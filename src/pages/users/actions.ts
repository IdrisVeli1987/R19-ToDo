import { createUser, deleteUser } from "../../Shared/api";

// CREATE USER

type CreateActionState = {
  email: string;
  error?: string;
};

export function createUserAction({
  refetchUsers,
}: {
  refetchUsers: () => void;
}) {
  return async (
    _: CreateActionState,
    formData: FormData
  ): Promise<CreateActionState> => {
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

type DeleteUserActionState = {
  error?: string;
};

// --------------------------------------------------------------------------

// DELETE USER

export function deleteUserAction({
  id,
  refetchUsers,
}: {
  refetchUsers: () => void;
  id: string;
}) {
  return async (): Promise<DeleteUserActionState> => {
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

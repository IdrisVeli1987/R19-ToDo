import { createUser } from "../../Shared/api";

type CreateActionState = {
  email: string;
  error?: string;
};

export const createUserAction =
  ({ refetchUsers }: { refetchUsers: () => void }) =>
  async (
    prevState: CreateActionState,
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

// Action-асинхронная ф-ия, к-я делает переходы, ф-ия для transition

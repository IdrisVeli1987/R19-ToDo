import { createTask, deleteTask, Task } from "../../Shared/api";

// CREATE Task

type CreateActionState = {
  title: string;
  error?: string;
};

export type CreateTaskAction = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function createTaskAction({
  refetchTask,
  userId,
}: {
  userId: string;
  refetchTask: () => void;
}): CreateTaskAction {
  return async (_, formData) => {
    const title = formData.get("title") as string;

    try {
      const task: Task = {
        cretaedAt: Date.now(),
        done: false,
        userId,
        title,
        id: crypto.randomUUID(),
      };
      await createTask(task);
      refetchTask();
      return {
        title: "",
      };
    } catch {
      return {
        title,
        error: "Error while creating user",
      };
    }
  };
}

// Action-асинхронная ф-ия, к-я делает переходы, ф-ия для transition

// --------------------------------------------------------------------------

// DELETE Task

type DeleteTaskActionState = {
  error?: string;
};

export type DeleteTaskAction = (
  state: DeleteTaskActionState,
  formData: FormData
) => Promise<DeleteTaskActionState>;

export function deleteTaskAction({
  refetchTask,
}: {
  refetchTask: () => void;
}): DeleteTaskAction {
  return async (_, formData) => {
    const id = formData.get("id") as string;
    await deleteTask(id);
    try {
      await deleteTask(id);
      refetchTask();
      return {};
    } catch {
      return {
        error: "Error while deleting task",
      };
    }
  };
}

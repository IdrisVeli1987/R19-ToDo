import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useMemo,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchTasks, Task } from "../../Shared/api";
import { useParams } from "react-router-dom";
import { createTaskAction, deleteTaskAction } from "./actions";

export const TodoListPage = () => {
  const { userId = "" } = useParams();

  const [paginatedTasksPromise, setTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } })
  );

  const refetchTasks = () =>
    startTransition(() => setTasksPromise(fetchTasks({ filters: { userId } })));

  const tasksPromise = useMemo(
    () => paginatedTasksPromise.then((r) => r.data),
    [paginatedTasksPromise]
  );

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks: user {userId}</h1>
      <CreateTaskForm refetchTask={refetchTasks} userId={userId} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong:{JSON.stringify(e)}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <TasksList tasksPromise={tasksPromise} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export function CreateTaskForm({
  userId,
  refetchTask,
}: {
  userId: string;
  refetchTask: () => void;
}) {
  // const [isPending, startTransition] = useTransition(); //хук, кот. возвращает isPending и startTransition. это ф-ия перехода, долгие обновления. можно сделать асинхронные запросы

  const [state, dispatch, isPending] = useActionState(
    createTaskAction({ refetchTask, userId }),
    { title: "" }
  );
  return (
    <form className="flex gap-2" action={dispatch}>
      <input name="title" type="text" className="border p-2 rounded" />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
        type="submit"
        defaultValue={state.title}
        disabled={isPending}
      >
        Add
      </button>
      {state.error && <div className="text-red-500">{state.error}</div>}
    </form>
  );
}

export function TasksList({
  tasksPromise,
  refetchTasks,
}: {
  tasksPromise: Promise<Task[]>;
  refetchTasks: () => void;
}) {
  const tasks = use(tasksPromise);
  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </div>
  );
}

export function TaskCard({
  task,
  refetchTasks,
}: {
  task: Task;
  refetchTasks: () => void;
}) {
  const [deleteState, handleDelete, isPending] = useActionState(
    deleteTaskAction({ refetchTasks }),
    {}
  );
  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {task.title}

      <form className="ml-auto" action={handleDelete}>
        <button
          disabled={isPending}
          className="bg-red-500 hover:bg-red-950 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-300"
        >
          Delete {deleteState.error && <div className="text-red-500">{deleteState.error}</div>}
        </button>
      </form>
    </div>
  );
}

// 1.40 min
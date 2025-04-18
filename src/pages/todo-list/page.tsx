import { Suspense, use, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchTasks, Task } from "../../Shared/api";
import { useParams } from "react-router-dom";

export const TodoListPage = () => {
  const { userId } = useParams();

  const [paginatedTasksPromise, setTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } })
  );

  const tasksPromise = useMemo(
    () => paginatedTasksPromise.then((r) => r.data),
    [paginatedTasksPromise]
  );

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Tasks: user {userId}</h1>
      <CreateTaskForm />
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

// Task
export function CreateTaskForm({}: {

}) {
  
  // const [email, setEmail] = useState("");

  // const [isPending, startTransition] = useTransition(); //хук, кот. возвращает isPending и startTransition. это ф-ия перехода, долгие обновления. можно сделать асинхронные запросы
  return (
    <form className="flex gap-2">
      <input name="email" type="email" className="border p-2 rounded" />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
        type="submit"
      >
        Add
      </button>
      <div className="text-red-500">error</div>
    </form>
  );
}

export function TasksList({ tasksPromise }: { tasksPromise: Promise<Task[]> }) {
  const tasks = use(tasksPromise);
  return (
    <div className="flex flex-col">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {task.title}

      <form className="ml-auto">
        <input type="hidden" name="id" value={task.id} />
        <button className="bg-red-500 hover:bg-red-950 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-300">
          Delete
        </button>
      </form>
    </div>
  );
}

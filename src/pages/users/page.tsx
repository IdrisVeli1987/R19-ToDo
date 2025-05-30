import { Suspense, useActionState, useOptimistic, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CreateUserAction, DeleteUserAction } from "./actions";
import { useUsers } from "./use-users";
import { Link } from "react-router-dom";

type User = {
  id: string;
  email: string;
};

export const UsersPage = () => {
  const { useUsersList, createUserAction, deleteUserAction } = useUsers();

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm createUserAction={createUserAction} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong:{JSON.stringify(e)}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList
            deleteUserAction={deleteUserAction}
            useUsersList={useUsersList}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export function CreateUserForm({
  createUserAction,
}: {
  createUserAction: CreateUserAction;
}) {
  // const [email, setEmail] = useState("");

  // const [isPending, startTransition] = useTransition(); //хук, кот. возвращает isPending и startTransition. это ф-ия перехода, долгие обновления. можно сделать асинхронные запросы

  const [state, dispatch] = useActionState(createUserAction, {
    email: "",
  });

  const [optimisticState, setOptimisticState] = useOptimistic(state);

  const form = useRef<HTMLFormElement>(null);

  return (
    <form
      className="flex gap-2"
      ref={form}
      action={(formData: FormData) => {
        setOptimisticState({ email: "" });
        dispatch(formData);
        form.current?.reset();
      }}
    >
      <input
        name="email"
        type="email"
        className="border p-2 rounded"
        defaultValue={optimisticState.email}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
        type="submit"
      >
        Add
      </button>
      {optimisticState.error && (
        <div className="text-red-500">{optimisticState.error}</div>
      )}
    </form>
  );
}

export function UsersList({
  deleteUserAction,
  useUsersList,
}: {
  useUsersList: () => User[];
  deleteUserAction: DeleteUserAction;
}) {
  const users = useUsersList(); // use -new hook. основная задача прямо в рендере превратить usersPromise в user'ов. не м.б массива
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleteUserAction={deleteUserAction}
        />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  deleteUserAction,
}: {
  user: User;
  deleteUserAction: DeleteUserAction;
}) {
  const [state, handleDelete] = useActionState(deleteUserAction, {});

  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}

      <form action={handleDelete} className="ml-auto">
        <input type="hidden" name="id" value={user.id} />
        <Link to= {`/${user.id}/tasks`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-auto disabled:bg-gray-500">Tasks</Link>
        <button
          className="bg-red-500 hover:bg-red-950 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-300"
          formAction={handleDelete}
        >
          Delete{" "}
          {state.error && <div className="text-red-500">{state.error}</div>}
        </button>
      </form>
    </div>
  );
}

// 1,13 min

import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useState,
  useTransition,
} from "react";
import { createUser, deleteUser, fetchUsers } from "../../Shared/api";
import { ErrorBoundary } from "react-error-boundary";
import { createUserAction } from "./actions";

type User = {
  id: string;
  email: string;
};

const defaultUsersPromise = fetchUsers();

export const UsersPage = () => {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong:{JSON.stringify(e)}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList usersPromise={usersPromise} refetchUsers={refetchUsers} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  
  const [email, setEmail] = useState("");

  // const [isPending, startTransition] = useTransition(); //хук, кот. возвращает isPending и startTransition. это ф-ия перехода, долгие обновления. можно сделать асинхронные запросы

  const [state, dispatch, isPending] = useActionState(
    createUserAction({ refetchUsers, setEmail }),
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ email });
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        className="border p-2 rounded"
        type="email"
        value={email}
        disabled={isPending}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
        disabled={isPending}
        type="submit"
      >
        Add
      </button>
      {state.error && <div className="text-red-500">{state.error}</div>}
    </form>
  );
}

export function UsersList({
  usersPromise,
  refetchUsers,
}: {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
}) {
  const users = use(usersPromise); // new hook. основная задача прямо в рендере превратить usersPromise в user'ов. не м.б массива
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  refetchUsers,
}: {
  user: User;
  refetchUsers: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteUser(user.id);
      refetchUsers();
    });
  };

  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}

      <button
        className="bg-red-500 hover:bg-red-950 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-300"
        type="button"
        disabled={isPending}
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
}

// 40 min

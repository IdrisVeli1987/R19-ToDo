import { useState } from "react";

type User = {
  id: string;
  email: string;
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsers([...users, { id: crypto.randomUUID(), email }]);
    setEmail("");
  };

  const handleDelete = (id: string) => {
    setUsers((lastUsers) => lastUsers.filter((user) => user.id !== id));
  };

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <section>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            className="border p-2 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            type="submit"
          >
            Add
          </button>
        </form>
      </section>

      <section>
        <div className="flex flex-col">
          {users.map((user) => (
            <div
              className="border p-2 m-2 rounded bg-gray-100 flex gap-2"
              key={user.id}
            >
              {user.email}

              <button
                className="bg-red-500 hover:bg-red-950 text-white font-bold py-2 px-4 rounded ml-auto"
                type="button"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

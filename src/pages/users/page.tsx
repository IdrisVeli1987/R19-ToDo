import { useState } from "react";

type User = {
  id: string;
  email: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsers([...users, { id: Date.now().toString(), email }]);
    setEmail("");
  };

  return (
    <main>
      <h1 className="text-3xl font-bold underline">Users</h1>
      <section>
        <form onSubmit={handleSubmit}>
          <input
            className="border p-2 m-2 rounded"
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
            <div className="border p-2 m-2 rounded bg-gray-100" key={user.id}>
              {user.email}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default UsersPage;

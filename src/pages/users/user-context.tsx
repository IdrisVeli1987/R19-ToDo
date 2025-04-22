import React, {
  createContext,
  startTransition,
  use,
  useState
} from "react";
import { fetchUsers, User } from "../../Shared/api";

type UserContextType = {
  users: Promise<User[]>;
  refetchUsers: () => void;
};

const UsersContext = createContext<UserContextType | null>(null);

const defaultUsersPromise = fetchUsers();
export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);

  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return (
    <UserContext value={{ users: usersPromise, refetchUsers }}>
      {children}
    </UserContext>
  );
}

export function useUsers() {

  const context = use(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}

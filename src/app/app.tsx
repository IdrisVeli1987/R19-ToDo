import { Route, Routes } from "react-router-dom";
import { TodoListPage } from "../pages/todo-list";
import { UsersPage } from "../pages/users";
import { UsersProvider } from "../pages/users/users-context";

export function App() {
  return (
    <UsersProvider>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/:userId/tasks" element={<TodoListPage />} />
      </Routes>
    </UsersProvider>
  );
}


import { Route, Routes } from "react-router-dom";
import { TodoListPage } from "../pages/todo-list";
import { UsersPage } from "../pages/users";


export function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/:userId/tasks" element={<TodoListPage />} />
    </Routes>
  );
}

// 7 min

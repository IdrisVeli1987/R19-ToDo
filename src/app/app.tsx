import { Route, Routes } from "react-router-dom";

fetch("http://localhost:3001/users").then((res) => {
  console.log(res);
});

export function App() {
  return (
    <Routes>
      <Route path="/" />
      <Route path="/:userId/tasks" />
    </Routes>
  );
}

// 7 min

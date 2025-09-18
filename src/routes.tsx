import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EdgesPage from "./pages/EdgesPage";

// Временные заглушки для страниц, которые будут реализованы позже
const CurrentsPage = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#1a1a1a",
      color: "#ffffff",
      fontSize: "1.5rem",
    }}
  >
    Страница Currents будет реализована позже
  </div>
);

const HistoriesPage = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#1a1a1a",
      color: "#ffffff",
      fontSize: "1.5rem",
    }}
  >
    Страница Histories будет реализована позже
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <EdgesPage />,
  },
  {
    path: "/currents/:edgeId",
    element: <CurrentsPage />,
  },
  {
    path: "/histories/:edgeId",
    element: <HistoriesPage />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

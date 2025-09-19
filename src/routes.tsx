import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EdgesPage from "./pages/EdgesPage";
import CurrentsPage from "./pages/CurrentsPage";
import HistoriesPage from "./pages/HistoriesPage";

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

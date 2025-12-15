import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage, { loginAction } from "@/features/auth/login-page";
import ProtectedLayout from "@/components/layout/protected-layout";

// Placeholder components
import BoardPage, { boardLoader } from "@/features/board/pages/board-page";
import BoardNewPage, { createPostAction } from "@/features/board/pages/board-new-page";
const DashboardPage = () => <div>Dashboard Feature (To be implemented)</div>;

import ErrorPage from "@/components/error-page";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
    action: loginAction,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
      },
      {
        path: "posts/new",
        element: <BoardNewPage />,
        action: createPostAction,
      },
      {
        path: "posts",
        element: <BoardPage />,
        loader: boardLoader,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

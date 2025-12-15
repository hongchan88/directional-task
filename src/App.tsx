import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage, { loginAction } from "@/features/auth/login-page";
import ProtectedLayout from "@/components/layout/protected-layout";

// Placeholder components
import BoardPage, { boardLoader } from "@/features/board/pages/board-page";
const DashboardPage = () => <div>Dashboard Feature (To be implemented)</div>;

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
    action: loginAction,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
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

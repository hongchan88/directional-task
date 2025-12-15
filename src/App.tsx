import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/login-page";
import ProtectedLayout from "@/components/layout/protected-layout";

// Placeholder components
const BoardPage = () => <div>Board Feature (To be implemented)</div>;
const DashboardPage = () => <div>Dashboard Feature (To be implemented)</div>;

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
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

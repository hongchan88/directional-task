import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { Link } from "react-router-dom";

export default function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Coding Task</h1>
            <nav className="flex gap-4 text-sm font-medium">
              <Link to="/posts" className="text-slate-600 hover:text-blue-600">Board</Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-blue-600">Dashboard</Link>
            </nav>
          </div>
          <button 
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Sign out
          </button>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

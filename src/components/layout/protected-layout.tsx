import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-8 items-center">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Coding Task</h1>
            <nav className="flex gap-4 text-sm font-medium">
              <Link to="/posts" className="text-slate-600 hover:text-blue-600 transition-colors">Board</Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">Dashboard</Link>
            </nav>
          </div>
          <button 
            onClick={logout}
            className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-slate-100"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
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

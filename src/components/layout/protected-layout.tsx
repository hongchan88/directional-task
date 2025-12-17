import { Navigate, Outlet, useLocation, useNavigation } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { 
  BoardPageSkeleton, 
  BoardDetailSkeleton, 
  DashboardSkeleton, 
  FormPageSkeleton 
} from "@/components/skeletons";

// Determine which skeleton to show based on the destination path
function getSkeletonForPath(pathname: string) {
  if (pathname === "/posts" || pathname === "/posts/") {
    return <BoardPageSkeleton />;
  }
  if (pathname === "/posts/new") {
    return <FormPageSkeleton />;
  }
  if (pathname.match(/^\/posts\/[^/]+\/edit$/)) {
    return <FormPageSkeleton />;
  }
  if (pathname.match(/^\/posts\/[^/]+$/)) {
    return <BoardDetailSkeleton />;
  }
  if (pathname.startsWith("/dashboard")) {
    return <DashboardSkeleton />;
  }
  return null;
}

export default function ProtectedLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigation = useNavigation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Show skeleton during navigation (loading state)
  const isLoading = navigation.state === "loading";
  const destinationPath = navigation.location?.pathname || "";
  const skeleton = isLoading ? getSkeletonForPath(destinationPath) : null;

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
          {skeleton || <Outlet />}
        </div>
      </main>
    </div>
  );
}


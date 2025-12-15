import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="text-lg text-slate-600">Sorry, an unexpected error has occurred.</p>
      <div className="bg-white p-4 rounded border shadow-sm text-red-500 font-mono text-sm max-w-lg overflow-auto">
        {isRouteErrorResponse(error) ? (
            <p>
                {error.status} {error.statusText}
            </p>
        ) : (
            <p>{(error as Error)?.message || "Unknown Error"}</p>
        )}
      </div>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
}

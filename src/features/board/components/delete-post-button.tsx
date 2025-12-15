import { useFetcher } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeletePostButtonProps {
  postId: string;
  className?: string;
}

export function DeletePostButton({ postId, className }: DeletePostButtonProps) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting" || fetcher.state === "loading";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (confirm("Are you sure you want to delete this post?")) {
      const formData = new FormData();
      formData.append("postId", postId);
      formData.append("intent", "delete");
      fetcher.submit(formData, { method: "delete", action: "/posts" });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 transition-opacity opacity-0 group-hover:opacity-100", className)}
      onClick={handleDelete}
      disabled={isDeleting}
      type="button"
    >
        {isDeleting ? (
           <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
            <Trash2 className="h-4 w-4" />
        )}
      <span className="sr-only">Delete</span>
    </Button>
  );
}

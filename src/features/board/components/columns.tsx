import { ColumnDef } from "@tanstack/react-table";
import { Post, Category } from "@/features/board/types";
import { ArrowUpDown, Edit, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DeletePostButton } from "./delete-post-button";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableResizing: true,
    size: 50, // Smaller weight
    cell: ({ row }) => <div className="truncate">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableResizing: true,
    size: 500, // Large weight to take up space
    cell: ({ row }) => {
        return (
            <div className="font-medium truncate text-slate-900">
                {row.getValue("title")}
            </div>
        )
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    enableResizing: true,
    size: 100,
    cell: ({ row }) => {
      const category = row.getValue("category") as Category;
      const colors = {
        [Category.NOTICE]: "bg-red-100 text-red-800",
        [Category.QNA]: "bg-yellow-100 text-yellow-800",
        [Category.FREE]: "bg-green-100 text-green-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[category]}`}>
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "Author",
    enableResizing: true,
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
    },
    enableResizing: true,
    size: 100,
  },
  {
    id: "actions",
    enableResizing: false,
    size: 80,
    cell: ({ row }) => {
      // Conditional rendering based on user ownership
      // We need to use hook inside the cell component
      // eslint-disable-next-line
      const { user } = useAuth(); // It Works because Cell is a component
      const isAuthor = user?.id === row.original.userId;
      console.log(user , row.original.userId, "user")

      if (!isAuthor) return null;

      return (
        <div className="flex justify-end gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-opacity opacity-0 group-hover:opacity-100" asChild>
                <Link to={`/posts/${row.original.id}/edit`}>
                    <Edit className="h-4 w-4" />
                </Link>
             </Button>
             <DeletePostButton postId={row.original.id} />
        </div>
      );
    },
  },
];

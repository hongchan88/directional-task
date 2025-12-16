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
    cell: ({ row }) => {
        const user = row.original.user;
        return (
            <div className="truncate" title={user?.email || row.getValue("userId")}>
                {user?.email || row.getValue("userId")}
            </div>
        );
    }
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
    accessorKey: "tags",
    header: "Tags",
    enableResizing: true,
    size: 200,
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[] | undefined;
      if (!tags || tags.length === 0) return <span className="text-slate-400">-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      );
    },
  },
];

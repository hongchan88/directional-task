import { ColumnDef } from "@tanstack/react-table";
import { Post, Category } from "@/features/board/types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableResizing: true,
    size: 80,
    cell: ({ row }) => <div className="w-[80px] truncate">{row.getValue("id")}</div>,
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
    size: 300,
    cell: ({ row }) => {
        return (
            <Link to={`/posts/${row.original.id}`} className="font-medium hover:underline text-blue-600">
                {row.getValue("title")}
            </Link>
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
    size: 120,
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
    size: 120,
  },
];

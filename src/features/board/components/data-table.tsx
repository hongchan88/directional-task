import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnResizeMode,
  VisibilityState,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSortingChange?: (sorting: SortingState) => void;
  sorting?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSortingChange,
  sorting,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    // We are handling sorting on the server, but we need this for UI state if we wanted client sorting. 
    // For server sorting, we just pass the state visually.
    // However, TanStack Table's "Sorting" is usually client-side unless 'manualSorting' is true.
    manualSorting: true, 
    onSortingChange: (updater) => {
        // We'll expose this if we need internal state, but mostly we rely on props
        if (typeof updater === 'function') {
           const newSorting = updater(sorting || []);
           onSortingChange?.(newSorting);
        } else {
           onSortingChange?.(updater);
        }
    },
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div>
        <div className="flex items-center py-4">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter(
                    (column) => column.getCanHide()
                )
                .map((column) => {
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm"
                style={{
                    width: "100%",
                    tableLayout: "fixed",
                }}
            >
            <thead className="[&_tr]:border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100">
                    {headerGroup.headers.map((header) => {
                    return (
                        <th
                        key={header.id}
                        className="h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 relative group"
                        style={{
                            width: header.getSize(),
                        }}
                        >
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        <div
                            {...{
                                onMouseDown: header.getResizeHandler(),
                                onTouchStart: header.getResizeHandler(),
                                className: `absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-slate-300 opacity-0 group-hover:opacity-100 ${
                                    header.column.getIsResizing() ? 'bg-blue-500 opacity-100' : ''
                                }`,
                            }}
                        />
                        </th>
                    );
                    })}
                </tr>
                ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
                {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100"
                    >
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                            style={{
                                width: cell.column.getSize(),
                            }}
                        >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={columns.length} className="h-24 text-center">
                    No results.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    </div>
  );
}

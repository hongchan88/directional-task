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
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSortingChange?: (sorting: SortingState) => void;
  sorting?: SortingState;
  onRowClick?: (data: TData) => void;
  persistenceKey?: string;
  renderRowAction?: (data: TData) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSortingChange,
  sorting,
  onRowClick,
  persistenceKey,
  renderRowAction,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');
    const [columnSizing, setColumnSizing] = React.useState<Record<string, number>>(() => {
        if (persistenceKey) {
            const saved = localStorage.getItem(persistenceKey);
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    React.useEffect(() => {
        if (persistenceKey) {
            localStorage.setItem(persistenceKey, JSON.stringify(columnSizing));
        }
    }, [columnSizing, persistenceKey]);

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
    onColumnSizingChange: setColumnSizing,
    state: {
      sorting,
      columnVisibility,
      columnSizing,
    },
  });

  return (
    <div>
        <div className="flex items-center py-4">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto mr-2 rounded-full">
                Hide / View Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter(
                    (column) => column.getCanHide()
                )
                .map((column) => {
                    const isVisible = column.getIsVisible();
                    return (
                    <DropdownMenuItem
                        key={column.id}
                        onSelect={(e) => {
                            e.preventDefault();
                            column.toggleVisibility(!isVisible);
                        }}
                        className="capitalize flex items-center gap-2 cursor-pointer"
                    >
                        {isVisible ? (
                            <Eye className="h-4 w-4 text-blue-500" />
                        ) : (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                        )}
                        {column.id}
                    </DropdownMenuItem>
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
                    className={`border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 group relative ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(row.original)}
                    >
                    {row.getVisibleCells().map((cell, index) => (
                        <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                            style={{
                                width: cell.column.getSize(),
                            }}
                        >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        {index === row.getVisibleCells().length - 1 && renderRowAction && (
                            <div 
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-md shadow-sm border p-1 z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {renderRowAction(row.original)}
                            </div>
                        )}
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category } from "../types";
import { X } from "lucide-react";

interface BoardToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: Category | undefined;
  onCategoryChange: (value: Category | undefined) => void;
}

export function BoardToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: BoardToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-md border text-slate-900">
      <div className="flex flex-1 items-center space-x-2 w-full">
        <Input
          placeholder="Search items..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-9 w-full sm:w-[250px] lg:w-[350px]"
        />
        {/* Category Filter Buttons */}
        <div className="flex gap-2">
            {[Category.NOTICE, Category.QNA, Category.FREE].map((cat) => (
                <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange(category === cat ? undefined : cat)}
                    className="h-9"
                >
                    {cat}
                </Button>
            ))}
        </div>
        
        {(search || category) && (
          <Button
            variant="ghost"
            onClick={() => {
                onSearchChange("");
                onCategoryChange(undefined);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

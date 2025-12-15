import { Form, useNavigation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CreatePostDto } from "@/features/board/types";
import { useState } from "react";

interface PostFormProps {
  initialData?: CreatePostDto;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export function PostForm({ initialData, errors, disabled }: PostFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Controlled state for Shadcn Select
  const [category, setCategory] = useState<string>(initialData?.category || Category.FREE);

  return (
    <Form method="post" className="space-y-6">
       {/* Title */}
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
                id="title" 
                name="title" 
                placeholder="Heads up! Design update..." 
                defaultValue={initialData?.title} 
                className={errors?.title ? "border-red-500" : ""}
                required
            />
            {errors?.title && <p className="text-sm text-red-500 font-medium">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <input type="hidden" name="category" value={category} />
            <Select value={category} onValueChange={setCategory} disabled={disabled}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(Category).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                            {cat}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Body */}
        <div className="space-y-2">
            <Label htmlFor="body">Content</Label>
            <Textarea 
                id="body" 
                name="body" 
                placeholder="Write your thoughts here..." 
                defaultValue={initialData?.body} 
                className={`min-h-[250px] resize-none ${errors?.body ? "border-red-500" : ""}`}
                required
            />
            {errors?.body && <p className="text-sm text-red-500 font-medium">{errors.body}</p>}
        </div>

        {/* General Error */}
        {errors?.global && (
             <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md font-medium">
                {errors.global}
             </div>
        )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || disabled}>
            {isSubmitting ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </Form>
  );
}

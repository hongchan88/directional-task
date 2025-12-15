import { Form, useNavigation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  // Quick controlled state for Select (native for now)
  const [category, setCategory] = useState<Category>(initialData?.category || Category.FREE);

  return (
    <Form method="post" className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Post Details</h3>
        
        {/* Title */}
        <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title</label>
            <Input 
                id="title" 
                name="title" 
                placeholder="Enter post title" 
                defaultValue={initialData?.title} 
                className={errors?.title ? "border-red-500" : ""}
                required
            />
            {errors?.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
            <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {Object.values(Category).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>

        {/* Body */}
        <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Content</label>
            <Textarea 
                id="body" 
                name="body" 
                placeholder="Write your content here..." 
                defaultValue={initialData?.body} 
                className={`min-h-[200px] ${errors?.body ? "border-red-500" : ""}`}
                required
            />
            {errors?.body && <p className="text-sm text-red-500">{errors.body}</p>}
        </div>

        {/* General Error */}
        {errors?.global && (
             <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {errors.global}
             </div>
        )}
      </div>

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

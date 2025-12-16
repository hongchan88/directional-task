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
import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

// Validation constants
const MAX_TITLE_LENGTH = 80;
const MAX_BODY_LENGTH = 2000;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 24;

interface PostFormProps {
  initialData?: CreatePostDto & { tags?: string[] };
  errors?: Record<string, string>;
  disabled?: boolean;
}

export function PostForm({ initialData, errors, disabled }: PostFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Controlled state
  const [category, setCategory] = useState<string>(initialData?.category || Category.FREE);
  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Tag handlers
  const addTag = (value: string) => {
    const trimmed = value.trim().slice(0, MAX_TAG_LENGTH);
    if (!trimmed) return;
    
    // Deduplicate (case-insensitive)
    const exists = tags.some(t => t.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setTagInput("");
      return;
    }
    
    if (tags.length >= MAX_TAGS) return;
    
    setTags([...tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <Form method="post" className="space-y-6">
       {/* Title */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="title">Title</Label>
              <span className={`text-xs ${title.length > MAX_TITLE_LENGTH ? "text-red-500" : "text-muted-foreground"}`}>
                {title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <Input 
                id="title" 
                name="title" 
                placeholder="Heads up! Design update..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE_LENGTH}
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

        {/* Tags */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="tags">Tags</Label>
              <span className={`text-xs ${tags.length >= MAX_TAGS ? "text-red-500" : "text-muted-foreground"}`}>
                {tags.length}/{MAX_TAGS}
              </span>
            </div>
            <input type="hidden" name="tags" value={JSON.stringify(tags)} />
            <div className={`flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] ${errors?.tags ? "border-red-500" : "border-input"}`}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {tags.length < MAX_TAGS && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => addTag(tagInput)}
                  placeholder={tags.length === 0 ? "Add tags (press Enter or comma)" : ""}
                  className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                  maxLength={MAX_TAG_LENGTH}
                  disabled={disabled}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Press Enter or comma to add. Max {MAX_TAGS} tags, {MAX_TAG_LENGTH} chars each.</p>
            {errors?.tags && <p className="text-sm text-red-500 font-medium">{errors.tags}</p>}
        </div>

        {/* Body */}
        <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="body">Content</Label>
              <span className={`text-xs ${body.length > MAX_BODY_LENGTH ? "text-red-500" : "text-muted-foreground"}`}>
                {body.length}/{MAX_BODY_LENGTH}
              </span>
            </div>
            <Textarea 
                id="body" 
                name="body" 
                placeholder="Write your thoughts here..." 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={MAX_BODY_LENGTH}
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

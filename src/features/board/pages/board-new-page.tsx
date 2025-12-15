import { ActionFunctionArgs, redirect, useActionData } from "react-router-dom";
import { PostForm } from "../components/post-form";
import { createPost } from "../api/board-api";
import { Category } from "../types";
import { BANNED_WORDS } from "@/lib/constants";

export async function createPostAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const category = formData.get("category") as Category;

  const errors: Record<string, string> = {};

  // Validation
  if (!title || title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters string.";
  }
  if (!body || body.trim().length < 5) {
    errors.body = "Content must be at least 5 characters long.";
  }

  // Banned Words Validation
  const contentToCheck = (title + " " + body).toLowerCase();
  const foundBannedWord = BANNED_WORDS.find(word => contentToCheck.includes(word.toLowerCase()));
  
  if (foundBannedWord) {
    errors.global = `Failed to post: Contains banned word "${foundBannedWord}".`;
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  try {
    const response = await createPost({
        title,
        body,
        category,
        tags: [] // Optional tags implementation
    });
    console.log(response,"response")
    return redirect("/posts");
  } catch (err: any) {
    return {
        global: err.response?.data?.message || "Failed to create post. Please try again."
    };
  }
}

export default function BoardNewPage() {
  const errors = useActionData() as Record<string, string> | undefined;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Create New Post</h2>
        <p className="text-muted-foreground">Share your thoughts with the team.</p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <PostForm errors={errors} />
      </div>
    </div>
  );
}

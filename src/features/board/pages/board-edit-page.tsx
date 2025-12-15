import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData } from "react-router-dom";
import { PostForm } from "../components/post-form";
import { getPost, updatePost } from "../api/board-api";
import { Category, Post } from "../types";
import { BANNED_WORDS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Loader to fetch existing post
export async function boardEditLoader({ params }: LoaderFunctionArgs) {
  if (!params.postId) throw new Error("Post ID is required");
  const post = await getPost(params.postId);
  return post;
}

// Action to update post
export async function updatePostAction({ request, params }: ActionFunctionArgs) {
  if (!params.postId) throw new Error("Post ID is required");

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const category = formData.get("category") as Category;

  const errors: Record<string, string> = {};

  // Validation (Same as create)
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
    errors.global = `Failed to update: Contains banned word "${foundBannedWord}".`;
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  try {
    await updatePost(params.postId, {
        title,
        body,
        category,
    });
    return redirect("/posts");
  } catch (err: any) {
    return {
        global: err.response?.data?.message || "Failed to update post. Please try again."
    };
  }
}

export default function BoardEditPage() {
  const post = useLoaderData() as Post;
  const errors = useActionData() as Record<string, string> | undefined;

  return (
    <div className="max-w-3xl mx-auto py-8">
       <Card>
            <CardHeader>
                <CardTitle>Edit Post</CardTitle>
                <CardDescription>Update your post content.</CardDescription>
            </CardHeader>
            <CardContent>
                <PostForm initialData={post} errors={errors} />
            </CardContent>
       </Card>
    </div>
  );
}

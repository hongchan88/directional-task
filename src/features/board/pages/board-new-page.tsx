import { ActionFunctionArgs, redirect, useActionData } from "react-router-dom";
import { PostForm } from "../components/post-form";
import { createPost } from "../api/board-api";
import { Category } from "../types";
import { BANNED_WORDS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


// Validation constants
const MAX_TITLE_LENGTH = 80;
const MAX_BODY_LENGTH = 2000;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 24;

export async function createPostAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const category = formData.get("category") as Category;
  const tagsRaw = formData.get("tags") as string;

  // Parse tags from JSON
  let tags: string[] = [];
  try {
    tags = tagsRaw ? JSON.parse(tagsRaw) : [];
  } catch {
    tags = [];
  }

  const errors: Record<string, string> = {};

  // Title validation
  if (!title || title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be at most ${MAX_TITLE_LENGTH} characters.`;
  }

  // Body validation
  if (!body || body.trim().length < 1) {
    errors.body = "Content is required.";
  } else if (body.length > MAX_BODY_LENGTH) {
    errors.body = `Content must be at most ${MAX_BODY_LENGTH} characters.`;
  }

  // Tags validation
  if (tags.length > MAX_TAGS) {
    errors.tags = `Maximum ${MAX_TAGS} tags allowed.`;
  }
  const invalidTag = tags.find(t => t.length > MAX_TAG_LENGTH);
  if (invalidTag) {
    errors.tags = `Each tag must be at most ${MAX_TAG_LENGTH} characters.`;
  }

  // Deduplicate tags (case-insensitive)
  const uniqueTags = [...new Map(tags.map(t => [t.toLowerCase(), t])).values()];

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
        tags: uniqueTags
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
    <div className="max-w-3xl mx-auto py-8">
       <Card>
            <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Share your updates, questions, or thoughts with the team.</CardDescription>
            </CardHeader>
            <CardContent>
                <PostForm errors={errors} />
            </CardContent>
       </Card>
    </div>
  );
}

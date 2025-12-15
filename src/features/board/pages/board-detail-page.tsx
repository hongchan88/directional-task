import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import { getPost } from "../api/board-api";
import { Category, Post } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { DeletePostButton } from "../components/delete-post-button";
import { requireAuth } from "@/lib/require-auth";

export async function boardDetailLoader({ params }: LoaderFunctionArgs) {
  requireAuth();
  if (!params.postId) throw new Error("Post ID is required");
  const post = await getPost(params.postId);
  return post;
}

export default function BoardDetailPage() {
  const post = useLoaderData() as Post;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAuthor = user?.id === post.userId;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/posts")}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-slate-700">Back to Board</h2>
      </div>

       <Card>
            <CardHeader className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                ${post.category === Category.NOTICE ? "bg-red-100 text-red-800" : 
                                  post.category === Category.QNA ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-green-100 text-green-800"}`}>
                                {post.category}
                            </span>
                            <span className="text-sm text-slate-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <CardTitle className="text-2xl">{post.title}</CardTitle>
                        <CardDescription>
                            By User {post.userId}
                        </CardDescription>
                    </div>
                    
                    {isAuthor && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <DeletePostButton postId={post.id} className="opacity-100" />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="prose max-w-none mt-4">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed min-h-[200px]">
                    {post.body}
                </div>
            </CardContent>
       </Card>
    </div>
  );
}

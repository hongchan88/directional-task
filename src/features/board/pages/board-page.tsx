import { useState, useEffect, useRef, useCallback } from "react";
import { useLoaderData, useSearchParams, Link, useNavigate, useFetcher } from "react-router-dom";
import { getPosts } from "@/features/board/api/board-api";
import { Post, PostListResponse, Category } from "@/features/board/types";
import { LoaderFunctionArgs } from "react-router-dom";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { BoardToolbar } from "../components/board-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-provider";
import { DeletePostButton } from "../components/delete-post-button";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { SortingState } from "@tanstack/react-table";


// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

import { deletePost } from "../api/board-api";
import { ActionFunctionArgs } from "react-router-dom";

export async function boardAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const postId = formData.get("postId") as string;
    if (!postId) return { error: "Post ID is required" };
    
    try {
        await deletePost(postId);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete post" };
    }
  }
  return null;
}

import { requireAuth } from "@/lib/require-auth";

export async function boardLoader({ request }: LoaderFunctionArgs) {
  requireAuth();
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 20;
  const search = url.searchParams.get("search") || undefined;
  const category = (url.searchParams.get("category") as Category) || undefined;
  const sort = (url.searchParams.get("sort") as "title" | "createdAt") || "createdAt";
  const order = (url.searchParams.get("order") as "asc" | "desc") || "desc";

  const data = await getPosts({ page, limit, search, category, sort, order });
  return { data, params: { page, limit, search, category, sort, order } };
}

export default function BoardPage() {
  const { data: initialData, params } = useLoaderData() as { data: PostListResponse, params: any };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fetcher = useFetcher<{ data: PostListResponse }>();
  // State to accumulate posts for infinite scroll
  const [posts, setPosts] = useState<Post[]>(initialData?.items || []);
  const [nextCursor, setNextCursor] = useState<number | null>(initialData?.nextCursor ?? null);

  // Reset posts and cursor when main filter change (search/category) from loader
  useEffect(() => {
    if (initialData?.items) {
        setPosts(initialData.items);
        setNextCursor(initialData.nextCursor ?? null);
    }
  }, [initialData]);

  // Handle Fetcher data (Append)
  useEffect(() => {
    if (fetcher.data?.data) { // Check fetcher data wrapper
        const newItems = fetcher.data.data.items || [];
        setPosts((prev) => {
            const unique = newItems.filter(p => !prev.find(existing => existing.id === p.id));
            return [...prev, ...unique];
        });
        setNextCursor(fetcher.data.data.nextCursor ?? null);
    }
  }, [fetcher.data]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (fetcher.state === "loading") return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      // Check if we have a nextCursor to fetch more
      if (entries[0].isIntersecting && nextCursor) {
        // Load next page
        
        // If we were using cursor-based API, we'd pass nextCursor.
        // For page-based, we calculate next page.
        // Or if the API is page-based but returns nextCursor as next page number (which our mock does)
        // We can just use `nextCursor` as the page param if it represents page number.
        // Our mock returns `page + 1` or null.
        // So we can use `nextCursor` directly if logic aligns.
        // Or calculate: `const nextPage = Math.ceil(posts.length / params.limit) + 1;`
        // Let's rely on calculation for safety or reset logic, but strictly check hasMore.
        // Reverting to calculation to match existing logic style but gated by nextCursor.
        
        const nextPage = Math.ceil(posts.length / params.limit) + 1;
        const searchParams = new URLSearchParams();
        searchParams.set("page", nextPage.toString());
        searchParams.set("limit", params.limit.toString());
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.sort) searchParams.set("sort", params.sort);
        if (params.order) searchParams.set("order", params.order);
        
        fetcher.load(`?${searchParams.toString()}`);
      }
    });
    if (node) observer.current.observe(node);
  }, [fetcher.state, posts.length, nextCursor, params]);

  // Local state for Toolbar UI
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = (searchParams.get("category") as Category) || undefined;
  
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchValue, 500);

  // Sync Search with URL
  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
        setSearchParams(prev => {
            if (debouncedSearch) prev.set("search", debouncedSearch);
            else prev.delete("search");
            prev.set("page", "1");
            return prev;
        });
    }
  }, [debouncedSearch, setSearchParams, initialSearch]);

  const handleCategoryChange = (cat: Category | undefined) => {
    setSearchParams(prev => {
        if (cat) prev.set("category", cat);
        else prev.delete("category");
        prev.set("page", "1");
        return prev;
    });
  };

  // Sorting State derived from URL
  const sorting: SortingState = [
    { 
        id: searchParams.get("sort") || "createdAt", 
        desc: (searchParams.get("order") || "desc") === "desc" 
    }
  ];

  const handleSortingChange = (newSorting: SortingState) => {
    const firstSort = newSorting[0];
    setSearchParams(prev => {
        if (firstSort) {
            prev.set("sort", firstSort.id);
            prev.set("order", firstSort.desc ? "desc" : "asc");
        } else {
            // Default reset if all sorting cleared
            prev.set("sort", "createdAt");
            prev.set("order", "desc");
        }
        prev.set("page", "1");
        return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Board</h2>
        <Link 
            to="new"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
            Write Post
        </Link>
      </div>

      <BoardToolbar 
        search={searchValue}
        onSearchChange={setSearchValue}
        category={initialCategory}
        onCategoryChange={handleCategoryChange}
      />

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns} 
            data={posts} 
            sorting={sorting}
            onSortingChange={handleSortingChange}
            onRowClick={(post) => navigate(`/posts/${post.id}`)}
            persistenceKey="board-columns"
            renderRowAction={(post) => {
                const isAuthor = user?.id === post.userId;
                if (!isAuthor) return null;
                return (
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" asChild>
                            <Link to={`/posts/${post.id}/edit`}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <DeletePostButton postId={post.id} className="opacity-100" />
                    </div>
                );
            }}
          />
          
          {/* Loading Indicator & Trigger */}
          <div ref={lastPostElementRef} className="py-4 text-sm text-slate-500 text-center min-h-[50px]">
              {fetcher.state === "loading" ? "Loading more..." : (
                  nextCursor ? "Scroll for more" : "No more posts"
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

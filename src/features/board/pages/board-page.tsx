import { useState, useEffect, useRef, useCallback } from "react";
import { useLoaderData, useSearchParams, Link, useNavigate, useFetcher } from "react-router-dom";
import { getPosts } from "@/features/board/api/board-api";
import { Post, PostListResponse, Category } from "@/features/board/types";
import { LoaderFunctionArgs } from "react-router-dom";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { BoardToolbar } from "../components/board-toolbar";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export async function boardLoader({ request }: LoaderFunctionArgs) {
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
  const fetcher = useFetcher<{ data: PostListResponse }>();
  // State to accumulate posts for infinite scroll
  const [posts, setPosts] = useState<Post[]>(initialData?.items || []);
  console.log(posts,"posts")
  // Reset posts when main filter change (search/category) from loader
  useEffect(() => {
    if (initialData?.items) {
        setPosts(initialData.items);
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
    }
  }, [fetcher.data]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (fetcher.state === "loading") return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      // Check if we have a nextCursor to fetch more
      if (entries[0].isIntersecting && initialData?.nextCursor) {
        // Load next page
        // If API uses cursor logic, we should use cursor param. But currently our loader uses page/limit.
        // The mock API might return nextCursor but still support page/limit or it might expect cursor?
        // Assuming we stick to page based if the API is 'fe-hiring-test' which often is page/limit.
        // But if it returned nextCursor, maybe it wants cursor based?
        // Let's stick to page loop for now but use nextCursor existence as "hasMore".
        
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
  }, [fetcher.state, posts.length, initialData?.nextCursor, params]);

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

      <div className="rounded-md bg-white border">
        <DataTable columns={columns} data={posts} />
        
        {/* Loading Indicator & Trigger */}
        <div ref={lastPostElementRef} className="py-4 text-sm text-slate-500 text-center min-h-[50px]">
            {fetcher.state === "loading" ? "Loading more..." : (
                initialData?.nextCursor ? "Scroll for more" : "No more posts"
            )}
        </div>
      </div>
    </div>
  );
}

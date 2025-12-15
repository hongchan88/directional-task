import { api } from "@/lib/axios";
import { Post, PostListParams, PostListResponse, CreatePostDto, UpdatePostDto, Category } from "../types";

import mockPosts from "./mock-posts.json";

const BASE = "/posts";
const USE_MOCK_DATA = false;

// Helper for Mock Data
const getMockPosts = async (params: PostListParams): Promise<PostListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay

  let filtered = (mockPosts as unknown as Post[]);

  // 1. Filter
  if (params.category) {
      filtered = filtered.filter(p => p.category === params.category);
  }
  if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q));
  }

  // 2. Sort
  const sortField = params.sort || 'createdAt';
  const order = params.order || 'desc';
  filtered = [...filtered].sort((a, b) => { // Create copy to sort
      let valA: any = a[sortField as keyof Post];
      let valB: any = b[sortField as keyof Post];
      
      if (sortField === 'createdAt') {
           valA = new Date(valA).getTime();
           valB = new Date(valB).getTime();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
  });

  // 3. Pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);

  const hasMore = end < filtered.length;
  
  return {
    items,
    prevCursor: page > 1 ? page - 1 : null,
    nextCursor: hasMore ? page + 1 : null,
  };
};

const getRealPosts = async (params: PostListParams): Promise<PostListResponse> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.category) searchParams.append("category", params.category);
  if (params.sort) searchParams.append("sort", params.sort);
  if (params.order) searchParams.append("order", params.order);

  const response = await api.get(`${BASE}?${searchParams.toString()}`);
  return response.data;
};

export const getPosts = async (params: PostListParams): Promise<PostListResponse> => {
    if (USE_MOCK_DATA) {
        return getMockPosts(params);
    }
    return getRealPosts(params);
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`${BASE}/${id}`);
  return response.data;
};

export const  createPost = async (data: CreatePostDto): Promise<Post> => {
  const response = await api.post(BASE, data);
  console.log(response,"response")
  return response.data;
};

export const updatePost = async (id: string, data: UpdatePostDto): Promise<Post> => {
  const response = await api.patch(`${BASE}/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};

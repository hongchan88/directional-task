import { api } from "@/lib/axios";
import { Post, PostListParams, PostListResponse, CreatePostDto, UpdatePostDto } from "../types";

const BASE = "/posts";

export const getPosts = async (params: PostListParams): Promise<PostListResponse> => {
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

export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`${BASE}/${id}`);
  return response.data;
};

export const createPost = async (data: CreatePostDto): Promise<Post> => {
  const response = await api.post(BASE, data);
  return response.data;
};

export const updatePost = async (id: string, data: UpdatePostDto): Promise<Post> => {
  const response = await api.patch(`${BASE}/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};

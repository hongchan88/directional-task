export enum Category {
  NOTICE = "NOTICE",
  QNA = "QNA",
  FREE = "FREE",
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  createdAt: string;
}

export type CreatePostDto = {
  title: string;
  body: string;
  category: Category;
  tags: string[];
};

export type UpdatePostDto = Partial<CreatePostDto>;

export interface PostListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: Category;
  sort?: "title" | "createdAt";
  order?: "asc" | "desc";
}

export interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}

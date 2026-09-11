import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PostCreatePayload, PostOut } from "@/lib/types";

interface UsePostsOptions {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: "trending" | "latest" | "top";
}

export function usePosts({
  limit = 10,
  skip = 0,
  search = "",
  sortBy = "trending",
}: UsePostsOptions = {}) {
  return useQuery({
    queryKey: ["posts", { limit, skip, search, sortBy }],
    queryFn: async () => {
      const response = await api.get<PostOut[]>("/posts/", {
        params: {
          Limit: limit,
          skip: skip,
          search: search || undefined,
        },
      });

      const posts = response.data || [];

      // Client-side sorting for tabs
      const sorted = [...posts];
      if (sortBy === "trending" || sortBy === "top") {
        sorted.sort((a, b) => b.votes - a.votes);
      } else if (sortBy === "latest") {
        sorted.sort((a, b) => b.Post.id - a.Post.id);
      }

      return sorted;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function usePost(id: number | string | undefined) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<PostOut[] | PostOut>(`/posts/${id}`);
      // FastAPI returns List[PostOut] for /posts/{id}
      if (Array.isArray(response.data)) {
        return response.data[0] || null;
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PostCreatePayload) => {
      const response = await api.post("/posts/", {
        title: payload.title,
        content: payload.content,
        published: payload.published ?? true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: PostCreatePayload }) => {
      const response = await api.put(`/posts/${id}`, {
        title: payload.title,
        content: payload.content,
        published: payload.published ?? true,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/posts/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.removeQueries({ queryKey: ["post", id] });
    },
  });
}

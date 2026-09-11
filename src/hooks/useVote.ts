import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PostOut } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export function useVote(postId: number, initialVotes: number = 0) {
  const queryClient = useQueryClient();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Track voted status in localStorage for persistent client indicator
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`pulse_voted_${postId}`);
      if (stored === "true") {
        setHasVoted(true);
      }
    }
  }, [postId]);

  const mutation = useMutation({
    mutationFn: async (dir: 1 | 0) => {
      const res = await api.post("/vote/", {
        post_id: postId,
        dir: dir,
      });
      return res.data;
    },
    onMutate: async (dir: 1 | 0) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Snapshot previous values
      const previousPosts = queryClient.getQueryData<PostOut[]>(["posts"]);
      const previousPost = queryClient.getQueryData<PostOut>(["post", postId]);

      const delta = dir === 1 ? 1 : -1;

      // Optimistically update posts list
      queryClient.setQueriesData<PostOut[]>({ queryKey: ["posts"] }, (old) => {
        if (!old) return [];
        return old.map((item) => {
          if (item.Post.id === postId) {
            return {
              ...item,
              votes: Math.max(0, item.votes + delta),
            };
          }
          return item;
        });
      });

      // Optimistically update single post
      queryClient.setQueryData<PostOut>(["post", postId], (old) => {
        if (!old) return old;
        return {
          ...old,
          votes: Math.max(0, old.votes + delta),
        };
      });

      // Optimistically update local voted state
      const nextVoted = dir === 1;
      setHasVoted(nextVoted);
      if (nextVoted) {
        localStorage.setItem(`pulse_voted_${postId}`, "true");
      } else {
        localStorage.removeItem(`pulse_voted_${postId}`);
      }

      return { previousPosts, previousPost, prevVoted: hasVoted };
    },
    onError: (err: any, _dir, context) => {
      // Roll back
      if (context?.previousPosts) {
        queryClient.setQueriesData({ queryKey: ["posts"] }, context.previousPosts);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.prevVoted !== undefined) {
        setHasVoted(context.prevVoted);
        if (context.prevVoted) {
          localStorage.setItem(`pulse_voted_${postId}`, "true");
        } else {
          localStorage.removeItem(`pulse_voted_${postId}`);
        }
      }

      // If user already voted (409 Conflict), adjust local state to true
      if (err?.response?.status === 409) {
        setHasVoted(true);
        localStorage.setItem(`pulse_voted_${postId}`, "true");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const toggleVote = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal("signin");
      return;
    }

    const nextDir: 1 | 0 = hasVoted ? 0 : 1;
    mutation.mutate(nextDir);
  }, [hasVoted, isAuthenticated, mutation, openAuthModal]);

  return {
    hasVoted,
    toggleVote,
    isVoting: mutation.isPending,
  };
}

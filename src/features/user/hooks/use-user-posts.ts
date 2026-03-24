import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/api/user-api";
import { Post } from "../types";

export const useUserPosts = (id: number) => {
  return useQuery<Post[]>({
    queryKey: ["posts", id],
    queryFn: () => getUserPosts(id),
    enabled: !!id,
  });
};

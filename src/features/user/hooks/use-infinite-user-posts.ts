import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPostsPaginated } from "@/api/user-api";

const LIMIT = 5;

export const useInfiniteUserPosts = (userId: number) => {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite", userId],
    queryFn: ({ pageParam }) => getUserPostsPaginated(userId, pageParam, LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length + 1;
    },
    enabled: !!userId,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      items: data.pages.flat(),
    }),
  });
};

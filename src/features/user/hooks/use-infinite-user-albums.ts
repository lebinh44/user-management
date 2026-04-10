import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserAlbumsPaginated } from "@/api/user-api";

const LIMIT = 5;

export const useInfiniteUserAlbums = (userId: number) => {
  return useInfiniteQuery({
    queryKey: ["albums", "infinite", userId],
    queryFn: ({ pageParam }) => getUserAlbumsPaginated(userId, pageParam, LIMIT),
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

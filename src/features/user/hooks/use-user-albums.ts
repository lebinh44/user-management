import { useQuery } from "@tanstack/react-query";
import { getUserAlbums } from "@/api/user-api";
import { Album } from "../types";

export const useUserAlbums = (id: number) => {
  return useQuery<Album[]>({
    queryKey: ["albums", id],
    queryFn: () => getUserAlbums(id),
    enabled: !!id,
  });
};

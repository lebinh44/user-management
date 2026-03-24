import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/user-api";
import { User } from "../types";

export const useUserDetail = (id: number) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

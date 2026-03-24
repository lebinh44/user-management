import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { getUsers } from "../../../api/user-api";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

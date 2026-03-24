import { useMemo } from "react";
import { User } from "../types";

export const useUserFilter = (users: User[], search: string, sort: string) => {
  return useMemo(() => {
    let result = [...users];

    // SEARCH
    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      );
    }

    // SORT
    if (sort === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (sort === "company") {
      result.sort((a, b) => a.company.name.localeCompare(b.company.name));
    }

    return result;
  }, [users, search, sort]);
};

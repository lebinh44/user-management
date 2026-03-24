import { create } from "zustand";

export type SortType = "name-asc" | "name-desc" | "company";

interface UserStore {
  search: string;
  sort: SortType;

  setSearch: (value: string) => void;
  setSort: (value: SortType) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  search: "",
  sort: "name-asc",

  setSearch: (value) => set({ search: value }),
  setSort: (value) => set({ sort: value }),
}));

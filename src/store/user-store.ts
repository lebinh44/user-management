import { create } from "zustand";

export type SortType = "name-asc" | "name-desc" | "company";

interface UserStore {
  search: string;
  sort: SortType;
  isOpenModal: boolean;
  editingUserId?: number;

  setSearch: (value: string) => void;
  setSort: (value: SortType) => void;
  openCreate: () => void;
  openEdit: (id: number) => void;
  closeModal: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  search: "",
  sort: "name-asc",
  isOpenModal: false,
  editingUserId: undefined,

  setSearch: (value) => set({ search: value }),
  setSort: (value) => set({ sort: value }),
  openCreate: () => set({ isOpenModal: true, editingUserId: undefined }),
  openEdit: (id) => set({ isOpenModal: true, editingUserId: id }),
  closeModal: () => set({ isOpenModal: false, editingUserId: undefined }),
}));

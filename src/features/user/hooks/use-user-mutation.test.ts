import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useCreateUser, useDeleteUser, useUpdateUser } from "./use-user-mutation";
import { createUser, deleteUser, updateUser } from "@/api/user-api";
import type { User } from "../types";

vi.mock("@/api/user-api", () => ({
  createUser: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
}));

const mockCreateUser = createUser as ReturnType<typeof vi.fn>;
const mockDeleteUser = deleteUser as ReturnType<typeof vi.fn>;
const mockUpdateUser = updateUser as ReturnType<typeof vi.fn>;

const mockUsers: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", company: { name: "Acme" } },
  { id: 2, name: "Bob", email: "bob@example.com", company: { name: "Globex" } },
];

const newUserPayload: Partial<User> = {
  name: "Charlie",
  email: "charlie@example.com",
  company: { name: "Initech" },
};

const serverReturnedUser: User = {
  id: 999,
  name: "Charlie",
  email: "charlie@example.com",
  company: { name: "Initech" },
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = createTestQueryClient();
  queryClient.setQueryData(["users"], mockUsers);
  vi.clearAllMocks();
});

afterEach(() => {
  queryClient.clear();
});

describe("useCreateUser", () => {
  it("adds user to cache optimistically before API resolves", async () => {
    let resolveCreate!: (value: User) => void;
    mockCreateUser.mockReturnValue(new Promise<User>((res) => (resolveCreate = res)));

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate(newUserPayload);
    });

    const cached = queryClient.getQueryData<User[]>(["users"]);
    expect(cached).toHaveLength(3);
    const optimisticUser = cached![2];
    expect(optimisticUser.name).toBe("Charlie");
    expect(optimisticUser.email).toBe("charlie@example.com");
    expect(optimisticUser.company.name).toBe("Initech");
    expect(typeof optimisticUser.id).toBe("number");
    expect(optimisticUser.id).not.toBe(999);

    resolveCreate(serverReturnedUser);
  });

  it("calls API with correct payload", async () => {
    mockCreateUser.mockResolvedValue(serverReturnedUser);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(newUserPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockCreateUser).toHaveBeenCalledTimes(1);
    expect(mockCreateUser).toHaveBeenCalledWith(newUserPayload, expect.any(Object));
  });

  it("invalidates 'users' query on success", async () => {
    mockCreateUser.mockResolvedValue(serverReturnedUser);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(newUserPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] });
  });

  it("reverts cache to previous state on error", async () => {
    mockCreateUser.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(newUserPayload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData<User[]>(["users"])).toEqual(mockUsers);
  });

  it("invalidates 'users' query on error", async () => {
    mockCreateUser.mockRejectedValue(new Error("Network error"));
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(newUserPayload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] });
  });
});

describe("useDeleteUser", () => {
  it("removes user from cache optimistically before API resolves", async () => {
    let resolveDelete!: () => void;
    mockDeleteUser.mockReturnValue(new Promise<void>((res) => (resolveDelete = res)));

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate(1);
    });

    const cached = queryClient.getQueryData<User[]>(["users"]);
    expect(cached).toHaveLength(1);
    expect(cached![0].id).toBe(2);
    expect(cached![0].name).toBe("Bob");

    resolveDelete();
  });

  it("calls API with correct ID", async () => {
    mockDeleteUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    expect(mockDeleteUser).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it("invalidates 'users' query on success", async () => {
    mockDeleteUser.mockResolvedValue(undefined);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] });
  });

  it("reverts cache to previous state on error", async () => {
    mockDeleteUser.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData<User[]>(["users"])).toEqual(mockUsers);
  });
});

describe("useUpdateUser", () => {
  it("merges partial data into matching user optimistically", async () => {
    let resolveUpdate!: (value: User) => void;
    mockUpdateUser.mockReturnValue(new Promise<User>((res) => (resolveUpdate = res)));

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ id: 1, data: { name: "Alice Updated", company: { name: "New Corp" } } });
    });

    const cached = queryClient.getQueryData<User[]>(["users"]);
    expect(cached).toHaveLength(2);
    const updatedUser = cached!.find((u) => u.id === 1)!;
    expect(updatedUser.name).toBe("Alice Updated");
    expect(updatedUser.email).toBe("alice@example.com"); // preserved
    expect(updatedUser.company.name).toBe("New Corp");
    expect(cached!.find((u) => u.id === 2)).toEqual(mockUsers[1]); // unchanged

    resolveUpdate({ ...mockUsers[0], name: "Alice Updated", company: { name: "New Corp" } });
  });

  it("preserves existing company name when data.company is undefined", async () => {
    let resolveUpdate!: (value: User) => void;
    mockUpdateUser.mockReturnValue(new Promise<User>((res) => (resolveUpdate = res)));

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({ id: 1, data: { name: "Alice Renamed" } });
    });

    const cached = queryClient.getQueryData<User[]>(["users"]);
    const updatedUser = cached!.find((u) => u.id === 1)!;
    expect(updatedUser.company.name).toBe("Acme"); // fallback to original

    resolveUpdate({ ...mockUsers[0], name: "Alice Renamed" });
  });

  it("calls API with correct arguments (unwraps id and data)", async () => {
    mockUpdateUser.mockResolvedValue({ ...mockUsers[0], name: "Alice Updated" });

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ id: 1, data: { name: "Alice Updated" } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    expect(mockUpdateUser).toHaveBeenCalledWith(1, { name: "Alice Updated" });
  });

  it("invalidates 'users' query on success", async () => {
    mockUpdateUser.mockResolvedValue({ ...mockUsers[0], name: "Alice Updated" });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ id: 1, data: { name: "Alice Updated" } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["users"] });
  });

  it("reverts cache to previous state on error", async () => {
    mockUpdateUser.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ id: 1, data: { name: "Alice Updated" } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const cached = queryClient.getQueryData<User[]>(["users"]);
    expect(cached!.find((u) => u.id === 1)!.name).toBe("Alice");
    expect(cached!.find((u) => u.id === 1)!.company.name).toBe("Acme");
  });
});

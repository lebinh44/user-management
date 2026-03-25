import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "@/api/user-api";
import { User } from "../types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onMutate: async (newUser: Partial<User>) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          ["users"],
          [
            ...previousUsers,
            {
              id: Date.now(),
              name: newUser.name || "",
              email: newUser.email || "",
              phone: newUser.phone,
              website: newUser.website,
              company: {
                name: newUser.company?.name || "",
              },
            },
          ]
        );
      }

      return { previousUsers };
    },

    onError: (_err, _newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          ["users"],
          previousUsers.filter((u) => u.id !== id)
        );
      }

      return { previousUsers };
    },

    onError: (_err, _id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          ["users"],
          previousUsers.map((u) =>
            u.id === id
              ? {
                  ...u,
                  ...data,
                  company: {
                    name: data.company?.name || u.company.name,
                  },
                }
              : u
          )
        );
      }

      return { previousUsers };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

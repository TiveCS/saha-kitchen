import { signUpAction } from "@/actions/auth.action";
import { deleteUser, editUser, getUsers } from "@/actions/users.action";
import { SignUpSchemaType } from "@/schemas/auth.schema";
import { EditUserSchemaType } from "@/schemas/users.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useNewUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["new-user"],
    mutationFn: async (data: SignUpSchemaType) => await signUpAction(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useGetUsers({ page, take }: { page?: number; take?: number }) {
  return useQuery({
    queryKey: ["users", page, take],
    queryFn: async () => await getUsers({ page, take }),
    placeholderData: keepPreviousData,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (id: number) => await deleteUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

export function useEditUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-user"],
    mutationFn: async (data: EditUserSchemaType) => {
      await editUser(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

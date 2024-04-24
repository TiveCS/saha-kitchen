"use client";

import {
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
  newProduct,
} from "@/actions/products.action";
import {
  EditProductSchemaType,
  NewProductSchemaType,
} from "@/schemas/product.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useGetProducts({
  take,
  page,
}: {
  page?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ["products", page, take],
    queryFn: async () => await getProducts({ page, take }),
    placeholderData: keepPreviousData,
  });
}

export function useGetProductByIdMutation() {
  return useMutation({
    mutationKey: ["get-product-by-id"],
    mutationFn: async (id: string) => await getProductById(id),
  });
}

export function useGetProductByIdQuery({ id }: { id: string }) {
  return useQuery({
    queryKey: ["get-product-by-id", id],
    queryFn: async () => await getProductById(id),
  });
}

export function useNewProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["new-products"],
    mutationFn: async (data: NewProductSchemaType) => await newProduct(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
    },
  });
}

export function useEditProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-products"],
    mutationFn: async (data: EditProductSchemaType) => await editProduct(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-products"],
    mutationFn: async (id: string) => await deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
    },
  });
}

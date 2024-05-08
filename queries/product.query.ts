"use client";

import {
  addProductMaterials,
  deleteProduct,
  deleteProductStockHistory,
  editProduct,
  editProductStockHistory,
  getProductById,
  getProductMaterialsStockAnalytics,
  getProducts,
  newProduct,
  newProductStockHistory,
  removeProductMaterials,
} from "@/actions/products.action";
import {
  EditProductSchemaType,
  EditProductStockHistorySchemaType,
  NewProductSchemaType,
  NewProductStockHistorySchemaType,
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

export function useNewProductStockHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["new-stock-history"],
    mutationFn: async (data: NewProductStockHistorySchemaType) =>
      await newProductStockHistory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useDeleteProductStockHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-stock-history"],
    mutationFn: async (id: string) => await deleteProductStockHistory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useEditProductStockHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-stock-history"],
    mutationFn: async (data: EditProductStockHistorySchemaType) =>
      await editProductStockHistory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useAddProductMaterials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-product-materials"],
    mutationFn: async (data: { productId: string; materialIds: string[] }) => {
      return await addProductMaterials(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useRemoveProductMaterials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-product-materials"],
    mutationFn: async (data: { productId: string; materialIds: string[] }) => {
      return await removeProductMaterials(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useGetProductMaterialsStock({
  productId,
  startPeriodDate,
  endPeriodDate,
}: {
  productId: string;
  startPeriodDate?: Date;
  endPeriodDate?: Date;
}) {
  return useQuery({
    queryKey: [
      "product-materials-stock",
      productId,
      startPeriodDate,
      endPeriodDate,
    ],
    queryFn: async () => {
      return await getProductMaterialsStockAnalytics({
        productId,
        startPeriodDate,
        endPeriodDate,
      });
    },
  });
}

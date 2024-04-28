"use client";

import { getTotalSalesForProducts } from "@/actions/products.action";
import {
  deleteSales,
  editSales,
  getSales,
  getSalesById,
  newSales,
} from "@/actions/sales.action";
import {
  EditSalesSchemaType,
  NewSalesSchemaType,
} from "@/schemas/sales.schema";
import { getLocalTimeZone } from "@internationalized/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetSalesQuery({
  productId,
  page,
  take,
  startOccurredAt,
  endOccurredAt,
}: {
  productId: string | null;
  page?: number;
  take?: number;
  startOccurredAt?: Date;
  endOccurredAt?: Date;
}) {
  return useQuery({
    queryKey: ["sales", productId, page, take, startOccurredAt, endOccurredAt],
    queryFn: async () => {
      if (!productId) return { count: 0, sales: [] };
      return await getSales({
        productId,
        page,
        take,
        startOccurredAt,
        endOccurredAt,
      });
    },
  });
}

export function useGetSalesMutation() {
  return useMutation({
    mutationKey: ["sales"],
    mutationFn: async ({
      productId,
      page,
      take,
    }: {
      productId: string;
      page?: number;
      take?: number;
    }) => await getSales({ productId, page, take }),
  });
}

export function useGetSalesById(id: string) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: async () => await getSalesById(id),
  });
}

export function useNewSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["new-sales"],
    mutationFn: async (data: NewSalesSchemaType) => {
      await newSales({
        ...data,
        occurred_at: data.occurred_at.toDate(getLocalTimeZone()),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
}

export function useEditSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-sales"],
    mutationFn: async (data: EditSalesSchemaType) =>
      await editSales({
        ...data,
        occurred_at: data.occurred_at.toDate(getLocalTimeZone()),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
}

export function useDeleteSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-sales"],
    mutationFn: async (id: string) => await deleteSales(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
}

export function useGetTotalSalesForProducts({
  productIds,
  startOccurredAt,
  endOccurredAt,
}: {
  productIds: string[];
  startOccurredAt?: Date;
  endOccurredAt?: Date;
}) {
  return useQuery({
    queryKey: ["sales", productIds, startOccurredAt, endOccurredAt],
    queryFn: async () => {
      return await getTotalSalesForProducts({
        productIds,
        startOccurredAt,
        endOccurredAt,
      });
    },
  });
}

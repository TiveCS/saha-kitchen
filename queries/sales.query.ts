"use client";

import {
  getAvailableSalesTrendsYears,
  getSalesTrendsForProducts,
  getTotalSalesForProducts,
} from "@/actions/products.action";
import {
  deleteSales,
  editSales,
  getAvailableSalesCount,
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
      await newSales(data);
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
    mutationFn: async (data: EditSalesSchemaType) => await editSales(data),
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

export function useGetSalesTrendsForProducts(args: {
  productIds: string[];
  year?: number;
}) {
  return useQuery({
    queryKey: ["sales-trends", args.productIds, args.year],
    queryFn: async () => {
      const availableYears = await getAvailableSalesTrendsYears({
        productIds: args.productIds,
      });

      let trends = null;

      if (args.year) {
        trends = await getSalesTrendsForProducts({
          productIds: args.productIds,
          year: args.year,
        });
      }

      return { availableYears, trends };
    },
  });
}

export function useGetAvailableSalesCount(
  productId: string,
  occurredAt?: Date
) {
  return useQuery({
    queryKey: ["sales-count", productId, occurredAt],
    queryFn: async () => {
      if (!occurredAt) return 0;
      return await getAvailableSalesCount({ productId, occurredAt });
    },
  });
}

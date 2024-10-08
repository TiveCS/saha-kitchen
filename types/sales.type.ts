import { getSales } from "@/actions/sales.action";
import { NarrowArray } from "@/utils/type";
import { PurchaseSystem } from "@prisma/client";

export const PurchaseSystemAbbreviation: Record<PurchaseSystem, string> = {
  PRE_ORDER: "Pre Order",
  READY: "Ready",
} as const;

export type GetSalesCount = Awaited<ReturnType<typeof getSales>>["count"];
export type GetSalesMany = Awaited<ReturnType<typeof getSales>>["sales"];
export type GetSalesSingle = NarrowArray<GetSalesMany>;

export type ProductTotalSalesAnalytics = {
  productId: string;
  productName: string;
  totalSales: number;
  latestStock: number;
};

export type ProductTrendAnalytics = {
  productName: string;
  monthlySales: number[];
};

export type ProductTrendAnalyticsResult = Map<string, ProductTrendAnalytics>;

import { getProductById, getProducts } from "@/actions/products.action";
import { NarrowArray } from "@/utils/type";
import { Material, MaterialUnit } from "@prisma/client";
import { StockStatus } from "./app.type";

export type GetProductsCount = Awaited<ReturnType<typeof getProducts>>["count"];
export type GetProductsMany = Awaited<
  ReturnType<typeof getProducts>
>["products"];
export type GetProductsSingle = NarrowArray<GetProductsMany>;

export type ProductStockHistory = {
  index: number;
  id: string;
  currentStock: number;
  createdAt: Date;
  occurredAt: Date;
  reporter: string;
};

export type ProductMaterialDetail = {
  id: string;
  name: string;
  minimumStock: number;
  currentStock: number;
  stockStatus: StockStatus;
  unit: MaterialUnit;
};

export type ProductDetail = {
  id: string;
  createdAt: Date;
  name: string;
  price: number;
  minimumStock: number;
  stockHistories: ProductStockHistory[];
  materials: ProductMaterialDetail[];
};

export type GetProductByIdResult = ProductDetail | null;

export type ProductMaterialStockAnalytic = {
  materialId: string;
  materialName: string;
  minimumStock: number;
  currentStock: number;
  percentage: number;
};

export type ProductMaterialStockAnalyticsResult = {
  productName: string;
  stocks: ProductMaterialStockAnalytic[];
} | null;

export type ProductAvailability = {
  productId: string;
  productName: string;
  latestStock: number;
  sales: number;
  currentStock: number;
};

export type ProductsAvailabilityResult = ProductAvailability[] | null;

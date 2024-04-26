import { getProductById, getProducts } from "@/actions/products.action";
import { NarrowArray } from "@/utils/type";

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
  reporter: string;
};

export type ProductDetail = {
  id: string;
  createdAt: Date;
  name: string;
  price: number;
  minimumStock: number;
  stockHistories: ProductStockHistory[];
};

export type GetProductByIdResult = ProductDetail | null;

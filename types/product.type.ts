import { getProducts } from "@/actions/products.action";
import { NarrowArray } from "@/utils/type";

export type GetProductsCount = Awaited<ReturnType<typeof getProducts>>["count"];
export type GetProductsMany = Awaited<
  ReturnType<typeof getProducts>
>["products"];
export type GetProductsSingle = NarrowArray<GetProductsMany>;

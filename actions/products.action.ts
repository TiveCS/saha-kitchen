"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  EditProductSchemaType,
  EditProductStockHistorySchemaType,
  NewProductSchemaType,
  NewProductStockHistorySchemaType,
} from "@/schemas/product.schema";
import { StockStatus } from "@/types/app.type";
import {
  GetProductByIdResult,
  ProductMaterialStockAnalyticsResult,
  ProductsAvailabilityResult,
} from "@/types/product.type";
import {
  ProductTotalSalesAnalytics,
  ProductTrendAnalyticsResult,
} from "@/types/sales.type";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getMaterialStockAtDate,
  getMaterialsStockAtDate,
  getProductStockAtDate,
  getProductsStockAtDate,
} from "./stock.action";

export async function newProduct(data: NewProductSchemaType) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      minimumStock: data.minimum_stock,
      stockHistories: {
        create: {
          currentStock: data.initial_stock,
          reporter: { connect: { id: session.user.id } },
          occurredAt: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
        },
      },
    },
  });

  return {
    id: product.id,
    name: product.name,
    price: product.price.toNumber(),
    minimumStock: product.minimumStock.toNumber(),
    stock: data.initial_stock,
    stockStatus: StockStatus.OK,
    asset: product.price.times(data.initial_stock).toNumber(),
  };
}

export async function editProduct(data: EditProductSchemaType) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.product.update({
    where: { id: data.id },
    data: {
      name: data.name,
      price: data.price,
      minimumStock: data.minimum_stock,
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  revalidatePath(`/products/${data.id}`);
  revalidatePath("/products");
  revalidatePath("/analytics");

  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.product.delete({
    where: { id },
    select: { id: true, name: true },
  });

  revalidatePath("/products");
  revalidatePath("/analytics");

  return product;
}

export async function getProducts(args?: { page?: number; take?: number }) {
  const pageFirstIndex =
    args?.page && args?.take ? (args.page - 1) * args.take : 0;

  const [count, foundProducts] = await prisma.$transaction([
    prisma.product.count(),
    prisma.product.findMany({
      skip: pageFirstIndex,
      take: args?.take,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        minimumStock: true,
      },
    }),
  ]);

  const productStocks = await getProductsStockAtDate(
    foundProducts.map((p) => p.id)
  );

  const products = foundProducts.map((product, index) => {
    const stockData = productStocks.get(product.id);

    const stock = new Decimal(stockData?.latestStock || 0);
    const stockStatus: StockStatus = stock.gte(product.minimumStock)
      ? StockStatus.OK
      : StockStatus.RESTOCK;

    return {
      index: index + 1 + pageFirstIndex,
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      minimumStock: product.minimumStock.toNumber(),
      stock: stock.toNumber(),
      stockStatus,
      asset: product.price.times(stock).toNumber(),
    };
  });

  return {
    count,
    products,
  };
}

export async function getProductById(
  id: string
): Promise<GetProductByIdResult> {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      materials: {
        select: {
          id: true,
          name: true,
          minimumStock: true,
          unit: true,
        },
      },
      stockHistories: {
        orderBy: { occurredAt: "desc" },
        select: {
          id: true,
          currentStock: true,
          createdAt: true,
          occurredAt: true,
          reporter: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!product) return null;

  const materialStocks = await getMaterialsStockAtDate(
    product.materials.map((m) => m.id)
  );

  return {
    id: product.id,
    createdAt: product.createdAt,
    name: product.name,
    price: product.price.toNumber(),
    minimumStock: product.minimumStock.toNumber(),
    materials: product.materials.map((material) => {
      const stockData = materialStocks.get(material.id);

      const stock = new Decimal(stockData?.latestStock || 0);
      const stockStatus = stock.gte(material.minimumStock)
        ? StockStatus.OK
        : StockStatus.RESTOCK;

      return {
        id: material.id,
        name: material.name,
        minimumStock: material.minimumStock.toNumber(),
        currentStock: stock.toNumber(),
        unit: material.unit,
        stockStatus: stockStatus,
      };
    }),
    stockHistories: product.stockHistories.map((history, index) => {
      return {
        index: index + 1,
        id: history.id,
        occurredAt: history.occurredAt,
        createdAt: history.createdAt,
        currentStock: history.currentStock.toNumber(),
        reporter: history.reporter.name,
      };
    }),
  };
}

export async function newProductStockHistory(
  data: NewProductStockHistorySchemaType
) {
  const session = await auth();

  if (!session) return redirect("/login");

  try {
    const stockHistory = await prisma.productStockHistory.create({
      data: {
        currentStock: data.addition_stock,
        reporter: { connect: { id: session.user.id } },
        product: { connect: { id: data.product_id } },
        occurredAt: data.occurred_at,
      },
    });

    revalidatePath(`/products/${data.product_id}`);
    revalidatePath("/products");
    revalidatePath("/analytics");

    return {
      id: stockHistory.id,
      currentStock: stockHistory.currentStock.toNumber(),
      createdAt: stockHistory.createdAt,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Produk tidak ditemukan");
      }
    }
    throw error;
  }
}

export async function editProductStockHistory(
  data: EditProductStockHistorySchemaType
) {
  const session = await auth();

  if (!session) return redirect("/login");

  try {
    const stockHistory = await prisma.productStockHistory.update({
      where: { id: data.id },
      data: {
        currentStock: data.addition_stock,
        occurredAt: data.occurred_at,
      },
    });

    revalidatePath(`/products/${stockHistory.productId}`);
    revalidatePath("/products");
    revalidatePath("/analytics");

    return {
      id: stockHistory.id,
      currentStock: stockHistory.currentStock.toNumber(),
      createdAt: stockHistory.createdAt,
      updatedAt: stockHistory.updatedAt,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Riwayat stok tidak ditemukan");
      }
    }
    throw error;
  }
}

export async function deleteProductStockHistory(id: string) {
  const session = await auth();

  if (!session) return redirect("/login");

  try {
    const stockHistory = await prisma.productStockHistory.delete({
      where: { id },
    });

    revalidatePath(`/products/${stockHistory.productId}`);
    revalidatePath("/products");
    revalidatePath("/analytics");

    return stockHistory;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Riwayat stok tidak ditemukan");
      }
    }
    throw error;
  }
}

export async function addProductMaterials(args: {
  productId: string;
  materialIds: string[];
}) {
  const session = await auth();

  if (!session) return redirect("/login");

  try {
    await prisma.product.update({
      where: { id: args.productId },
      data: {
        materials: {
          connect: args.materialIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(`/products/${args.productId}`);
    revalidatePath("/analytics");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Produk tidak ditemukan");
      }
    }
    throw error;
  }
}

export async function removeProductMaterials(args: {
  productId: string;
  materialIds: string[];
}) {
  const session = await auth();

  if (!session) return redirect("/login");

  try {
    await prisma.product.update({
      where: { id: args.productId },
      data: {
        materials: {
          disconnect: args.materialIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(`/products/${args.productId}`);
    revalidatePath("/analytics");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Produk tidak ditemukan");
      }
    }
    throw error;
  }
}

export async function getTotalSalesForProducts({
  startOccurredAt,
  endOccurredAt,
  productIds,
}: {
  productIds: string[];
  startOccurredAt?: Date;
  endOccurredAt?: Date;
}): Promise<ProductTotalSalesAnalytics[]> {
  const session = await auth();

  if (!session) return redirect("/login");

  const productStocks = await getProductsStockAtDate(productIds, endOccurredAt);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      sales: {
        orderBy: { occurredAt: "desc" },
        select: {
          amount: true,
          occurredAt: true,
        },
        where: {
          occurredAt:
            startOccurredAt || endOccurredAt
              ? {
                  gte: startOccurredAt,
                  lte: endOccurredAt,
                }
              : undefined,
        },
      },
    },
  });

  return products.map((product) => {
    const stockData = productStocks.get(product.id);
    const latestStock = new Decimal(stockData?.latestStock ?? 0);
    let totalSales = new Decimal(0);

    product.sales.forEach((sale) => {
      totalSales = totalSales.add(sale.amount);
    });

    return {
      productId: product.id,
      productName: product.name,
      totalSales: totalSales.toNumber(),
      latestStock: latestStock.toNumber(),
    };
  });
}

export async function getAvailableSalesTrendsYears(args: {
  productIds: string[];
}): Promise<number[]> {
  const session = await auth();

  if (!session) return redirect("/login");

  const sales = await prisma.sales.findMany({
    where: { productId: { in: args.productIds } },
    select: {
      occurredAt: true,
    },
  });

  const years = Array.from(
    new Set(sales.map((sale) => sale.occurredAt.getFullYear()))
  );

  return years;
}

export async function getSalesTrendsForProducts(args: {
  productIds: string[];
  year: number;
}): Promise<ProductTrendAnalyticsResult> {
  const session = await auth();

  if (!session) return redirect("/login");

  const products = await prisma.product.findMany({
    where: { id: { in: args.productIds } },
    select: {
      id: true,
      name: true,
      sales: {
        where: {
          occurredAt: {
            gte: new Date(args.year, 0, 1),
            lte: new Date(args.year, 11, 31),
          },
        },
      },
    },
  });

  const result: ProductTrendAnalyticsResult = new Map();

  products.forEach((product) => {
    const monthlySales: number[] = Array(12).fill(undefined);

    product.sales.forEach((sale) => {
      monthlySales[sale.occurredAt.getMonth()] =
        sale.amount.toNumber() +
        (monthlySales[sale.occurredAt.getMonth()] ?? 0);
    });

    result.set(product.id, {
      productName: product.name,
      monthlySales,
    });
  });

  return result;
}

export async function getProductMaterialsStockAnalytics(args: {
  productId: string;
  startPeriodDate?: Date;
  endPeriodDate?: Date;
}): Promise<ProductMaterialStockAnalyticsResult> {
  const product = await prisma.product.findUnique({
    where: { id: args.productId },
    include: {
      materials: {
        select: {
          id: true,
          name: true,
          minimumStock: true,
          stockHistories: {
            orderBy: { occurredAt: "desc" },
            where: {
              createdAt:
                args.startPeriodDate || args.endPeriodDate
                  ? {
                      gte: args.startPeriodDate || undefined,
                      lte: args.endPeriodDate || undefined,
                    }
                  : undefined,
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  const stocksData = product.materials.map((material) => {
    const currentStock = material.stockHistories[0]?.currentStock || 0;

    const percentage = currentStock
      .div(material.minimumStock.times(2))
      .times(100);

    return {
      materialId: material.id,
      materialName: material.name,
      minimumStock: material.minimumStock.toNumber(),
      currentStock: currentStock.toNumber(),
      percentage: percentage.toNumber(),
    };
  });

  return {
    productName: product.name,
    stocks: stocksData,
  };
}

export async function getProductsAvailabilityAnalytics(args: {
  productIds: string[];
  startPeriodDate?: Date;
  endPeriodDate?: Date;
}): Promise<ProductsAvailabilityResult> {
  const products = await prisma.product.findMany({
    where: {
      id: { in: args.productIds },
    },
    select: {
      id: true,
      name: true,
      minimumStock: true,
      stockHistories: {
        orderBy: { occurredAt: "desc" },
        where: {
          createdAt:
            args.startPeriodDate || args.endPeriodDate
              ? {
                  gte: args.startPeriodDate || undefined,
                  lte: args.endPeriodDate || undefined,
                }
              : undefined,
        },
      },
      sales: {
        where: {
          occurredAt:
            args.startPeriodDate || args.endPeriodDate
              ? {
                  gte: args.startPeriodDate || undefined,
                  lte: args.endPeriodDate || undefined,
                }
              : undefined,
        },
      },
    },
  });

  return products.map((product) => {
    const latestStock =
      product.stockHistories[0]?.currentStock || new Decimal(0);
    const sales = product.sales.reduce(
      (acc, sale) => acc.add(sale.amount),
      new Decimal(0)
    );
    const currentStock = latestStock.minus(sales);

    return {
      productId: product.id,
      productName: product.name,
      latestStock: latestStock.toNumber(),
      sales: sales.toNumber(),
      currentStock: currentStock.toNumber(),
    };
  });
}

export async function getProductsFirstAndLastStockHistoryDate(
  productIds: string[]
): Promise<{
  firstDate: Date;
  latestDate: Date;
} | null> {
  const stockHistories = await prisma.productStockHistory.findMany({
    where: { productId: { in: productIds } },
    orderBy: { occurredAt: "desc" },
    select: {
      occurredAt: true,
    },
  });

  if (stockHistories.length === 0) return null;

  const firstDate = stockHistories[stockHistories.length - 1].occurredAt;
  const latestDate = stockHistories[0].occurredAt;

  return {
    firstDate,
    latestDate,
  };
}

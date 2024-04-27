"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  EditSalesActionSchemaType,
  NewSalesActionSchemaType,
} from "@/schemas/sales.schema";
import { ProductTotalSalesAnalytics } from "@/types/sales.type";
import { redirect } from "next/navigation";

export async function newSales(data: NewSalesActionSchemaType) {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN")
    throw new Error("Hanya admin yang bisa menambahkan data penjualan");

  const sales = await prisma.sales.create({
    data: {
      amount: data.amount,
      occurredAt: data.occurred_at,
      purchaseSystem: data.purchase_system,
      product: { connect: { id: data.product_id } },
      reporter: { connect: { id: session.user.id } },
      lastUpdatedBy: { connect: { id: session.user.id } },
    },
  });

  return {
    id: sales.id,
    amount: sales.amount.toNumber(),
    purchaseSystem: sales.purchaseSystem,
    productId: sales.productId,
    reporterId: sales.reporterId,
    occurredAt: sales.occurredAt,
    createdAt: sales.createdAt,
  };
}

export async function editSales(data: EditSalesActionSchemaType) {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN")
    throw new Error("Hanya admin yang bisa mengubah data penjualan");

  const sales = await prisma.sales.update({
    where: { id: data.id },
    data: {
      amount: data.amount,
      occurredAt: data.occurred_at,
      purchaseSystem: data.purchase_system,
      product: { connect: { id: data.product_id } },
      lastUpdatedBy: { connect: { id: session.user.id } },
    },
  });

  return {
    id: sales.id,
    amount: sales.amount.toNumber(),
    purchaseSystem: sales.purchaseSystem,
    productId: sales.productId,
    reporterId: sales.reporterId,
    occurredAt: sales.occurredAt,
    createdAt: sales.createdAt,
  };
}

export async function deleteSales(id: string) {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN")
    throw new Error("Hanya admin yang bisa menghapus data penjualan");

  const sales = await prisma.sales.delete({ where: { id } });

  return {
    id: sales.id,
    amount: sales.amount.toNumber(),
    purchaseSystem: sales.purchaseSystem,
    productId: sales.productId,
    reporterId: sales.reporterId,
    occurredAt: sales.occurredAt,
    createdAt: sales.createdAt,
  };
}

export async function getSales(args: {
  productId: string;
  page?: number;
  take?: number;
  startOccurredAt?: Date;
  endOccurredAt?: Date;
}) {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN")
    throw new Error("Hanya admin yang bisa melihat data penjualan");

  const pageFirstIndex =
    args?.page && args?.take ? (args.page - 1) * args.take : 0;

  const [count, foundSales] = await prisma.$transaction([
    prisma.sales.count({ where: { productId: args.productId } }),
    prisma.sales.findMany({
      take: args?.take,
      skip: pageFirstIndex,
      orderBy: { occurredAt: "desc" },
      where: {
        productId: args.productId,
        occurredAt:
          args.startOccurredAt || args.endOccurredAt
            ? {
                gte: args.startOccurredAt ? args.startOccurredAt : undefined,
                lte: args.endOccurredAt ? args.endOccurredAt : undefined,
              }
            : undefined,
      },
      include: {
        product: true,
        reporter: true,
        lastUpdatedBy: true,
      },
    }),
  ]);

  const sales = foundSales.map((sale, index) => ({
    index: pageFirstIndex + index + 1,
    id: sale.id,
    amount: sale.amount.toNumber(),
    purchaseSystem: sale.purchaseSystem,
    productId: sale.productId,
    reporterId: sale.reporterId,
    occurredAt: sale.occurredAt,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  }));

  return { count, sales };
}

export async function getSalesById(id: string) {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN")
    throw new Error("Hanya admin yang bisa melihat data penjualan");

  const sale = await prisma.sales.findUnique({
    where: { id },
    include: {
      product: true,
      reporter: true,
      lastUpdatedBy: true,
    },
  });

  if (!sale) throw new Error("Data penjualan tidak ditemukan");

  return {
    id: sale.id,
    amount: sale.amount.toNumber(),
    purchaseSystem: sale.purchaseSystem,
    productId: sale.productId,
    reporterId: sale.reporterId,
    occurredAt: sale.occurredAt,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
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

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      sales: {
        where: {
          occurredAt:
            startOccurredAt || endOccurredAt
              ? {
                  gte: startOccurredAt || undefined,
                  lte: endOccurredAt || undefined,
                }
              : undefined,
        },
      },
    },
  });

  const productTotalsSales: Map<string, number> = new Map();

  for (const product of products) {
    const totalSales = product.sales.reduce(
      (acc, sale) => acc + sale.amount.toNumber(),
      0
    );
    productTotalsSales.set(product.id, totalSales);
  }

  return products.map((product) => ({
    productId: product.id,
    productName: product.name,
    totalSales: productTotalsSales.get(product.id) || 0,
  }));
}

export async function getSalesTrendsForProducts(args?: {
  productIds: string[];
  startOccurredAt?: Date;
  endOccurredAt?: Date;
}) {}

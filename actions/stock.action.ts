import prisma from "@/lib/prisma";
import Decimal from "decimal.js";

type GetStockAtDateResult = {
  itemId: string;
  latestStock: number;
  occurredAt: Date | null;
};

export async function getProductsStockAtDate(
  productIds: string[],
  endDate?: Date
): Promise<Map<string, GetStockAtDateResult>> {
  const histories = await prisma.productStockHistory.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      productId: { in: productIds },
      occurredAt: endDate ? { lte: endDate } : undefined,
    },
  });

  const result: Map<string, GetStockAtDateResult> = new Map();

  histories.forEach((history) => {
    const foundStock = result.get(history.productId);
    const currentStock = new Decimal(foundStock?.latestStock ?? 0);

    result.set(history.productId, {
      itemId: history.productId,
      latestStock: currentStock.add(history.currentStock).toNumber(),
      occurredAt: history.occurredAt,
    });
  });

  return result;
}

export async function getProductStockAtDate(
  productId: string,
  endDate?: Date
): Promise<GetStockAtDateResult> {
  const histories = await prisma.productStockHistory.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      productId: productId,
      occurredAt: endDate ? { lte: endDate } : undefined,
    },
    select: {
      currentStock: true,
      occurredAt: true,
    },
  });

  let result = new Decimal(0);
  let latestOccurredAt: Date | null = null;

  histories.forEach((history) => {
    result = result.add(history.currentStock);
    latestOccurredAt = history.occurredAt;
  });

  return {
    itemId: productId,
    latestStock: result.toNumber(),
    occurredAt: latestOccurredAt,
  };
}

export async function getMaterialsStockAtDate(
  materialIds: string[],
  endDate?: Date
): Promise<Map<string, GetStockAtDateResult>> {
  const histories = await prisma.materialStockHistory.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      materialId: { in: materialIds },
      occurredAt: endDate ? { lte: endDate } : undefined,
    },
  });

  const result: Map<string, GetStockAtDateResult> = new Map();

  histories.forEach((history) => {
    const foundStock = result.get(history.materialId);
    const currentStock = new Decimal(foundStock?.latestStock ?? 0);

    result.set(history.materialId, {
      itemId: history.materialId,
      latestStock: currentStock.add(history.currentStock).toNumber(),
      occurredAt: history.occurredAt,
    });
  });

  return result;
}

export async function getMaterialStockAtDate(
  materialId: string,
  endDate?: Date
): Promise<GetStockAtDateResult> {
  const histories = await prisma.materialStockHistory.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      materialId: materialId,
      occurredAt: endDate ? { lte: endDate } : undefined,
    },
    select: {
      currentStock: true,
      occurredAt: true,
    },
  });

  let result = new Decimal(0);
  let latestOccurredAt: Date | null = null;

  histories.forEach((history) => {
    result = result.add(history.currentStock);
    latestOccurredAt = history.occurredAt;
  });

  return {
    itemId: materialId,
    latestStock: result.toNumber(),
    occurredAt: latestOccurredAt,
  };
}

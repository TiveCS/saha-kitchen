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

export async function getCumulativeProductStockAtDate(
  productId: string,
  endDate?: Date
): Promise<GetStockAtDateResult> {
  const stockHistories = await prisma.productStockHistory.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      productId,
      occurredAt: endDate ? { lte: endDate } : undefined,
    },
    select: {
      currentStock: true,
      occurredAt: true,
    },
  });

  const salesHistories = await prisma.sales.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      productId,
      occurredAt: endDate ? { lte: endDate } : undefined,
    },
    select: {
      amount: true,
      occurredAt: true,
    },
  });

  let result = new Decimal(0);

  stockHistories.forEach((history) => {
    result = result.add(history.currentStock);
  });

  salesHistories.forEach((sale) => {
    result = result.sub(sale.amount);
  });

  const endStock =
    stockHistories.length > 0
      ? stockHistories[stockHistories.length - 1].occurredAt
      : undefined;
  const endSale =
    salesHistories.length > 0
      ? salesHistories[salesHistories.length - 1].occurredAt
      : undefined;

  let latestEndOccurredAt = null;

  if (endStock && endSale) {
    latestEndOccurredAt = endStock > endSale ? endStock : endSale;
  }

  return {
    itemId: productId,
    latestStock: result.toNumber(),
    occurredAt: latestEndOccurredAt,
  };
}

export async function getCumulativeProductsStockAtDate(
  productIds: string[],
  endDate?: Date
): Promise<Map<string, GetStockAtDateResult>> {
  const result: Map<string, GetStockAtDateResult> = new Map();

  for (const productId of productIds) {
    const stock = await getCumulativeProductStockAtDate(productId, endDate);
    result.set(productId, stock);
  }

  return result;
}

// non-cumulative
export async function getProductStockInPeriod(
  productId: string,
  period: { start: Date; end: Date }
): Promise<{ itemId: string; stock: number }> {
  const stockHistories = await prisma.productStockHistory.findMany({
    orderBy: { occurredAt: "desc" },
    where: { productId, occurredAt: { gte: period.start, lte: period.end } },
  });

  let result = new Decimal(0);

  stockHistories.forEach((history) => {
    result = result.add(history.currentStock);
  });

  return { itemId: productId, stock: result.toNumber() };
}

export async function getProductsStockInPeriod(
  productIds: string[],
  period: { start: Date; end: Date }
): Promise<Map<string, { itemId: string; stock: number }>> {
  const result: Map<string, { itemId: string; stock: number }> = new Map();

  for (const productId of productIds) {
    const stock = await getProductStockInPeriod(productId, period);
    result.set(productId, stock);
  }

  return result;
}

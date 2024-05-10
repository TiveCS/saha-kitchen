"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  EditSalesActionSchemaType,
  NewSalesActionSchemaType,
} from "@/schemas/sales.schema";
import { toCalendarDate } from "@/utils/calendar-date";
import {
  CalendarDate,
  getLocalTimeZone,
  isSameDay,
} from "@internationalized/date";
import Decimal from "decimal.js";
import { redirect } from "next/navigation";
import { getProductStockAtDate } from "./stock.action";

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

export async function getAvailableSalesCount({
  productId,
  occurredAt,
}: {
  productId: string;
  occurredAt: Date;
}): Promise<number> {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN")
    throw new Error("Hanya admin yang bisa melihat data penjualan");

  // Hitung stok terbaru pada jangka waktu yang mencakup pada occurredAt
  // Misal stok terbaru di catat 20 Mei 2024, stok = 50
  // occurredAt = 25 Mei 2024
  // Daftar Sales :
  // 1. 20 Mei 2024, 10 sales
  // 2. 22 Mei 2024, 15 sales
  // 3. 24 Mei 2024, 20 sales
  // Maka, maxSalesCount = 50 - (10 + 15 + 20) = 5

  // Jika akan melakukan "insert" di antara beberapa riwayat stok
  // Misal, ada daftar riwayat stok:
  // 1. 20 Mei 2024, stok = 50
  // 2. 30 Mei 2024, stok = 100
  // occurredAt = 27 Mei 2024
  // Maka akan menggunakan stok 20 Mei 2024, yaitu 50
  // Lalu menghitung total sales diantara periode:
  // 20 Mei 2024 (tanggal stok tercatat sebelum occurredAt) - 30 Mei 2024 (riwayat stok setelah occurredAt terdekat)
  // Jika tidak ada riwayat stok setelah occuredAt, maka gunakan occurredAt sebagai tanggal terakhir

  const earlierStock = await getProductStockAtDate(productId, occurredAt);

  const afterStock = await prisma.productStockHistory.findFirst({
    orderBy: { occurredAt: "desc" },
    where: {
      productId: productId,
      occurredAt: { gt: occurredAt },
    },
    select: {
      occurredAt: true,
      currentStock: true,
    },
  });

  // Jika stok sebelum occurredAt tidak ada, tidak mungkin bisa melakukan penjualan
  if (!earlierStock || !earlierStock.occurredAt) return 0;

  const minDate: CalendarDate = toCalendarDate(earlierStock.occurredAt);

  const selectedMaxDate = afterStock?.occurredAt;
  const maxDate: CalendarDate | undefined =
    selectedMaxDate && toCalendarDate(selectedMaxDate);

  const sales = await prisma.sales.findMany({
    orderBy: { occurredAt: "desc" },
    where: {
      productId: productId,
      occurredAt: {
        gte: minDate.toDate(getLocalTimeZone()),
        lt:
          !maxDate || isSameDay(minDate, maxDate)
            ? undefined
            : maxDate.toDate(getLocalTimeZone()),
      },
    },
    select: {
      amount: true,
    },
  });

  const totalSales = sales.reduce(
    (acc, sale) => acc.add(sale.amount),
    new Decimal(0)
  );

  const availableStock = new Decimal(earlierStock.latestStock).minus(
    totalSales
  );

  return availableStock.toNumber();
}

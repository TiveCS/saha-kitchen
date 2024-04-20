"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  EditProductSchemaType,
  NewProductSchemaType,
} from "@/schemas/product.schema";
import { StockStatus } from "@/types/product.type";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";

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
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        minimumStock: true,
        stockHistories: {
          select: {
            currentStock: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    }),
  ]);

  const products = foundProducts.map((product, index) => {
    const stock = product.stockHistories[0]?.currentStock || new Decimal(0);
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

export async function getProductById(id: string) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      stockHistories: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) throw new Error("Produk tidak ditemukan!");

  return {
    id: product.id,
    createdAt: product.createdAt,
    name: product.name,
    price: product.price.toNumber(),
    minimumStock: product.minimumStock.toNumber(),
    stockHistories: product.stockHistories.map((history) => {
      return {
        currentStock: history.currentStock.toNumber(),
        createdAt: history.createdAt,
      };
    }),
  };
}

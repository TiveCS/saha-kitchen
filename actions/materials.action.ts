"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  EditMaterialSchemaType,
  NewMaterialSchemaType,
} from "@/schemas/material.schema";
import { StockStatus } from "@/types/app.type";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";

export async function newMaterial(data: NewMaterialSchemaType) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.material.create({
    data: {
      name: data.name,
      minimumStock: data.minimum_stock,
      unit: data.unit,
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
    unit: product.unit,
    minimumStock: product.minimumStock.toNumber(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function deleteMaterial(id: string) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const product = await prisma.material.delete({
    where: { id },
  });

  return {
    id: product.id,
    name: product.name,
    unit: product.unit,
    minimumStock: product.minimumStock.toNumber(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function getMaterials(args?: { page?: number; take?: number }) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const pageFirstIndex =
    args?.page && args?.take ? (args.page - 1) * args.take : 0;

  const [count, foundMaterials] = await prisma.$transaction([
    prisma.material.count(),
    prisma.material.findMany({
      skip: pageFirstIndex,
      take: args?.take,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        unit: true,
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

  const materials = foundMaterials.map((material, index) => {
    const stock = material.stockHistories[0]?.currentStock || new Decimal(0);
    const stockStatus: StockStatus = stock.gte(material.minimumStock)
      ? StockStatus.OK
      : StockStatus.RESTOCK;

    return {
      index: pageFirstIndex + index + 1,
      id: material.id,
      name: material.name,
      minimumStock: material.minimumStock.toNumber(),
      unit: material.unit,
      stock: stock.toNumber(),
      stockStatus,
    };
  });

  return { count, materials };
}

export async function getMaterialById(id: string) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const material = await prisma.material.findUnique({
    where: { id },
  });

  if (!material) {
    throw new Error("Material tidak ditemukan.");
  }

  return {
    id: material.id,
    name: material.name,
    unit: material.unit,
    minimumStock: material.minimumStock.toNumber(),
    createdAt: material.createdAt,
    updatedAt: material.updatedAt,
  };
}

export async function editMaterial(id: string, data: EditMaterialSchemaType) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  try {
    const material = await prisma.material.update({
      where: { id },
      data: {
        name: data.name,
        unit: data.unit,
        minimumStock: data.minimum_stock,
      },
    });

    return {
      id: material.id,
      name: material.name,
      unit: material.unit,
      minimumStock: material.minimumStock.toNumber(),
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Bahan baku tidak ditemukan.");
      }
    }
    throw error;
  }
}

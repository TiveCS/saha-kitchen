"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  EditMaterialSchemaType,
  EditMaterialStockHistorySchemaType,
  NewMaterialSchemaType,
  NewMaterialStockHistorySchemaType,
} from "@/schemas/material.schema";
import { StockStatus } from "@/types/app.type";
import { MaterialDetail } from "@/types/material.type";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
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
          occurredAt: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
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
            occurredAt: "desc",
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

export async function getMaterialById(
  id: string
): Promise<MaterialDetail | null> {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const material = await prisma.material.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      unit: true,
      minimumStock: true,
      createdAt: true,
      updatedAt: true,
      stockHistories: {
        orderBy: {
          occurredAt: "desc",
        },
        select: {
          id: true,
          currentStock: true,
          createdAt: true,
          occurredAt: true,
          reporter: { select: { name: true } },
        },
      },
    },
  });

  if (!material) return null;

  return {
    id: material.id,
    name: material.name,
    unit: material.unit,
    minimumStock: material.minimumStock.toNumber(),
    stockHistories: material.stockHistories.map((stockHistory, index) => ({
      index: index + 1,
      id: stockHistory.id,
      currentStock: stockHistory.currentStock.toNumber(),
      createdAt: stockHistory.createdAt,
      occurredAt: stockHistory.occurredAt,
      reporter: stockHistory.reporter.name,
    })),
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

export async function newMaterialStockHistory(
  data: NewMaterialStockHistorySchemaType
) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const material = await prisma.material.findUnique({
    where: { id: data.material_id },
  });

  if (!material) {
    throw new Error("Bahan baku tidak ditemukan.");
  }

  const stockHistory = await prisma.materialStockHistory.create({
    data: {
      currentStock: data.current_stock,
      material: { connect: { id: data.material_id } },
      reporter: { connect: { id: session.user.id } },
      occurredAt: data.occurred_at,
    },
  });

  revalidatePath(`/materials/${material.id}`);

  return {
    id: stockHistory.id,
    materialId: stockHistory.materialId,
    currentStock: stockHistory.currentStock.toNumber(),
    createdAt: stockHistory.createdAt,
  };
}

export async function editMaterialStockHistory(
  data: EditMaterialStockHistorySchemaType
) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  try {
    const stockHistory = await prisma.materialStockHistory.update({
      where: { id: data.id },
      data: {
        currentStock: data.current_stock,
        occurredAt: data.occurred_at,
      },
    });

    revalidatePath(`/materials/${stockHistory.materialId}`);

    return {
      id: stockHistory.id,
      materialId: stockHistory.materialId,
      currentStock: stockHistory.currentStock.toNumber(),
      createdAt: stockHistory.createdAt,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Riwayat stok tidak ditemukan.");
      }
    }
    throw error;
  }
}

export async function deleteMaterialStockHistory(id: string) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const stockHistory = await prisma.materialStockHistory.delete({
    where: { id },
  });

  revalidatePath(`/materials/${stockHistory.materialId}`);

  return {
    id: stockHistory.id,
    materialId: stockHistory.materialId,
    currentStock: stockHistory.currentStock.toNumber(),
    createdAt: stockHistory.createdAt,
  };
}

"use client";

import {
  deleteMaterial,
  deleteMaterialStockHistory,
  editMaterial,
  editMaterialStockHistory,
  getMaterials,
  newMaterial,
  newMaterialStockHistory,
} from "@/actions/materials.action";
import {
  EditMaterialSchemaType,
  EditMaterialStockHistorySchemaType,
  NewMaterialSchemaType,
  NewMaterialStockHistorySchemaType,
} from "@/schemas/material.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMaterials({
  page,
  take,
}: {
  page?: number;
  take?: number;
}) {
  return useQuery({
    queryKey: ["materials", page, take],
    queryFn: async () => await getMaterials({ page, take }),
  });
}

export function useNewMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["new-materials"],
    mutationFn: async (data: NewMaterialSchemaType) => await newMaterial(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-material"],
    mutationFn: async (id: string) => await deleteMaterial(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}

export function useEditMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-material"],
    mutationFn: async (dto: { id: string; data: EditMaterialSchemaType }) =>
      await editMaterial(dto.id, dto.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}

export function useNewMaterialStockHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["new-material-stock-history"],
    mutationFn: async (data: NewMaterialStockHistorySchemaType) =>
      await newMaterialStockHistory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}

export function useDeleteMaterialStockHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-material-stock-history"],
    mutationFn: async (id: string) => await deleteMaterialStockHistory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}

export function useEditMaterialStockHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-material-stock-history"],
    mutationFn: async (data: EditMaterialStockHistorySchemaType) =>
      await editMaterialStockHistory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["materials"],
      });
    },
  });
}

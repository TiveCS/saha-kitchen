"use client";

import {
  deleteMaterial,
  editMaterial,
  getMaterials,
  newMaterial,
} from "@/actions/materials.action";
import {
  EditMaterialSchemaType,
  NewMaterialSchemaType,
} from "@/schemas/material.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMaterials({
  page = 1,
  take = 6,
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

"use client";

import {
  NewProductMaterialSchema,
  NewProductMaterialSchemaType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FormInputSelect } from "./ui/FormInput";
import { useGetMaterials } from "@/queries/material.query";
import { ProductDetail } from "@/types/product.type";
import { useAddProductMaterials } from "@/queries/product.query";
import { toast } from "sonner";

interface NewProductMaterialFormProps {
  product: ProductDetail;
  onSuccess?: () => void;
}

export function NewProductMaterialForm({
  product,
  onSuccess,
}: NewProductMaterialFormProps) {
  const { formState, handleSubmit, control } =
    useForm<NewProductMaterialSchemaType>({
      resolver: zodResolver(NewProductMaterialSchema),
      defaultValues: {
        productId: product.id,
      },
    });
  const { data: getMaterials, isPending, isLoading } = useGetMaterials({});
  const { mutateAsync, isPending: isPendingMutate } = useAddProductMaterials();

  const onSubmit = async (data: NewProductMaterialSchemaType) => {
    const toastId = toast.loading("Menambahkan bahan baku...");

    try {
      await mutateAsync({
        productId: product.id,
        materialIds: [data.materialId],
      });

      toast.success("Bahan baku berhasil ditambahkan ke produk", {
        id: toastId,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Gagal menambahkan bahan baku ke produk", {
        id: toastId,
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const isDataLoading = !getMaterials || isPending || isLoading;

  if (isDataLoading) return <Skeleton className="w-full h-24 rounded-lg" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInputSelect
        control={control}
        name="materialId"
        selectProps={{
          selectionMode: "single",
          label: "Bahan Baku",
          placeholder: "Pilih bahan baku",
          isMultiline: true,
          items: getMaterials.materials,
          isLoading: isPending || isLoading,
          disabledKeys: product.materials.map((material) => material.id),
          children: getMaterials.materials.map((material) => {
            return (
              <SelectItem key={material.id} value={material.id}>
                {material.name}
              </SelectItem>
            );
          }),
        }}
      />

      <Button
        type="submit"
        color="primary"
        isLoading={isPendingMutate}
        isDisabled={isDataLoading}
        fullWidth
      >
        Tambah Bahan Baku
      </Button>
    </form>
  );
}

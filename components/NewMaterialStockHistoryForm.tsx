"use client";

import { useNewMaterialStockHistory } from "@/queries/material.query";
import {
  NewMaterialStockHistorySchema,
  NewMaterialStockHistorySchemaType,
} from "@/schemas/material.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInputNumber } from "./ui/FormInput";

interface NewMaterialStockHistoryFormProps {
  materialId: string;
  onSuccess?: () => void;
}

export function NewMaterialStockHistoryForm({
  materialId,
  onSuccess,
}: NewMaterialStockHistoryFormProps) {
  const { control, handleSubmit, formState, reset } =
    useForm<NewMaterialStockHistorySchemaType>({
      resolver: zodResolver(NewMaterialStockHistorySchema),
      defaultValues: {
        material_id: materialId,
        current_stock: 0,
      },
    });

  const { mutateAsync } = useNewMaterialStockHistory();

  const onSubmit = (data: NewMaterialStockHistorySchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data);
        reset();
        onSuccess?.();
      },
      {
        loading: "Menambahkan riwayat stok...",
        success: "Riwayat stok berhasil ditambahkan",
        error: "Gagal menambahkan riwayat stok",
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInputNumber
        control={control}
        name="current_stock"
        inputProps={{
          label: "Stok Saat Ini",
          placeholder: "Masukkan stok saat ini",
          variant: "bordered",
        }}
      />

      <Button
        type="submit"
        color="primary"
        isLoading={formState.isLoading || formState.isSubmitting}
        fullWidth
      >
        Tambah Riwayat Stok
      </Button>
    </form>
  );
}

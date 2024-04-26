"use client";

import { useEditMaterialStockHistory } from "@/queries/material.query";
import {
  EditMaterialStockHistorySchema,
  EditMaterialStockHistorySchemaType,
} from "@/schemas/material.schema";
import { MaterialStockHistory } from "@/types/material.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInputNumber } from "./ui/FormInput";

interface EditMaterialStockFormProps {
  stock: MaterialStockHistory;
  onSuccess?: () => void;
}

export function EditMaterialStockHistoryForm({
  stock,
  onSuccess,
}: EditMaterialStockFormProps) {
  const { control, handleSubmit, formState, reset } =
    useForm<EditMaterialStockHistorySchemaType>({
      resolver: zodResolver(EditMaterialStockHistorySchema),
      defaultValues: {
        id: stock.id,
        current_stock: stock.currentStock,
      },
    });

  const { mutateAsync, isPending } = useEditMaterialStockHistory();

  const onSubmit = (data: EditMaterialStockHistorySchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data);
        reset();
        onSuccess?.();
      },
      {
        loading: "Mengubah riwayat stok...",
        success: "Riwayat stok berhasil di ubah",
        error: "Gagal mengubah riwayat stok",
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
        isLoading={isPending || formState.isLoading || formState.isSubmitting}
        fullWidth
      >
        Ubah Riwayat Stok
      </Button>
    </form>
  );
}

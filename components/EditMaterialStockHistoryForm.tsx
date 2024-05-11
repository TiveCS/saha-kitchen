"use client";

import { TIMEZONE } from "@/constants";
import { useEditMaterialStockHistory } from "@/queries/material.query";
import {
  EditMaterialStockHistorySchema,
  EditMaterialStockHistorySchemaType,
} from "@/schemas/material.schema";
import { MaterialStockHistory } from "@/types/material.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { today } from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDatePicker, FormInputNumber } from "./ui/FormInput";

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
        addition_stock: stock.currentStock,
        occurred_at: stock.occurredAt,
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
        name="addition_stock"
        inputProps={{
          label: "Penambahan Stok",
          placeholder: "Masukan penambahan stok",
          variant: "bordered",
          description: 'Jika berkurang, masukkan angka negatif ("-")',
        }}
      />

      <FormDatePicker
        control={control}
        name="occurred_at"
        datePickerProps={{
          label: "Tanggal Riwayat Stok",
          maxValue: today(TIMEZONE),
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

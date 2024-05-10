"use client";

import { useEditProductStockHistory } from "@/queries/product.query";
import {
  EditProductStockHistorySchema,
  EditProductStockHistorySchemaType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDatePicker, FormInputNumber } from "./ui/FormInput";
import { ProductStockHistory } from "@/types/product.type";
import { getLocalTimeZone, today } from "@internationalized/date";

interface EditProductStockFormProps {
  stock: ProductStockHistory;
  onSuccess?: () => void;
}

export function EditProductStockForm({
  stock,
  onSuccess,
}: EditProductStockFormProps) {
  const { control, handleSubmit, formState, reset } =
    useForm<EditProductStockHistorySchemaType>({
      resolver: zodResolver(EditProductStockHistorySchema),
      defaultValues: {
        id: stock.id,
        current_stock: stock.currentStock,
        occurred_at: stock.createdAt,
      },
    });

  const { mutateAsync, isPending } = useEditProductStockHistory();

  const onSubmit = (data: EditProductStockHistorySchemaType) => {
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

      <FormDatePicker
        control={control}
        name="occurred_at"
        datePickerProps={{
          label: "Tanggal Riwayat Stok",
          maxValue: today(getLocalTimeZone()),
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

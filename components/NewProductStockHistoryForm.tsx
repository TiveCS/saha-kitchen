"use client";

import { useNewProductStockHistory } from "@/queries/product.query";
import {
  NewProductStockHistorySchema,
  NewProductStockHistorySchemaType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDatePicker, FormInputNumber } from "./ui/FormInput";

interface NewProductStockHistoryFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function NewProductStockHistoryForm({
  productId,
  onSuccess,
}: NewProductStockHistoryFormProps) {
  const { control, handleSubmit, formState, reset } =
    useForm<NewProductStockHistorySchemaType>({
      resolver: zodResolver(NewProductStockHistorySchema),
      defaultValues: {
        product_id: productId,
        addition_stock: 0,
        occurred_at: today(getLocalTimeZone()).toDate(getLocalTimeZone()),
      },
    });

  const { mutateAsync } = useNewProductStockHistory();

  const onSubmit = (data: NewProductStockHistorySchemaType) => {
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
          maxValue: today(getLocalTimeZone()),
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

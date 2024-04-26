"use client";

import {
  NewProductStockHistorySchema,
  NewProductStockHistorySchemaType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FormInputNumber } from "./ui/FormInput";
import { useNewProductStockHistory } from "@/queries/product.query";
import { toast } from "sonner";

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
        current_stock: 0,
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

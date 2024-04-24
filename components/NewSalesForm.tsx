"use client";

import { useGetProducts } from "@/queries/product.query";
import { useNewSales } from "@/queries/sales.query";
import {
  BaseSalesMutationSchema,
  NewSalesSchemaType,
} from "@/schemas/sales.schema";
import { GetProductsSingle } from "@/types/product.type";
import { PurchaseSystemAbbreviation } from "@/types/sales.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button, Card, CardBody, SelectItem } from "@nextui-org/react";
import { PurchaseSystem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FormAutoComplete,
  FormDatePicker,
  FormInputNumber,
  FormInputSelect,
} from "./ui/FormInput";

export function NewSalesForm() {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<NewSalesSchemaType>({
    resolver: zodResolver(BaseSalesMutationSchema),
    defaultValues: {
      amount: 0,
      occurred_at: today(getLocalTimeZone()),
      product_id: "",
    },
  });

  const {
    data: getProducts,
    isFetching: isGetProductsFetching,
    isLoading: isGetProductsLoading,
    isPending: isGetProductsPending,
  } = useGetProducts({});

  const { mutateAsync, isPending } = useNewSales();

  const onSubmit = (data: NewSalesSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: () => router.push("/sales"),
        });
      },
      {
        loading: "Menambahkan data penjualan...",
        success: "Data penjualan berhasil ditambahkan",
        error: (err: Error) =>
          err?.message || "Gagal menambahkan data penjualan",
      }
    );
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormAutoComplete
            control={control}
            name="product_id"
            processItem={(item) => {
              const product = item as GetProductsSingle;
              return {
                key: product.id,
                label: product.name,
                value: product.id,
              };
            }}
            autoCompleteProps={{
              label: "Produk",
              placeholder: "Pilih Produk",
              items: getProducts?.products || [],
              isDisabled:
                isGetProductsFetching ||
                isGetProductsLoading ||
                isGetProductsPending ||
                formState.isLoading ||
                formState.isSubmitting,
              isLoading:
                isGetProductsLoading ||
                isGetProductsFetching ||
                isGetProductsPending,
            }}
          />

          <FormInputNumber
            control={control}
            name="amount"
            inputProps={{
              label: "Jumlah Penjualan",
            }}
          />

          <FormInputSelect
            control={control}
            name="purchase_system"
            selectProps={{
              label: "Sistem Pembelian",
              placeholder: "Pilih Sistem Pembelian",
              children: Object.values(PurchaseSystem).map((value) => (
                <SelectItem key={value} value={value}>
                  {PurchaseSystemAbbreviation[value]}
                </SelectItem>
              )),
            }}
          />

          <FormDatePicker
            control={control}
            name="occurred_at"
            datePickerProps={{
              label: "Tanggal Penjualan",
              maxValue: today(getLocalTimeZone()),
            }}
          />

          <Button
            isLoading={
              isPending || formState.isLoading || formState.isSubmitting
            }
            color="primary"
            type="submit"
            fullWidth
          >
            Tambah Data Penjualan
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

"use client";

import { TIMEZONE } from "@/constants";
import { useGetProducts } from "@/queries/product.query";
import { useGetAvailableSalesCount, useNewSales } from "@/queries/sales.query";
import {
  BaseSalesMutationSchema,
  NewSalesSchemaType,
} from "@/schemas/sales.schema";
import { GetProductsSingle } from "@/types/product.type";
import { PurchaseSystemAbbreviation } from "@/types/sales.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { today } from "@internationalized/date";
import { Button, Card, CardBody, Input, SelectItem } from "@nextui-org/react";
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
import { formatNumber } from "@/utils/formatter";

export function NewSalesForm() {
  const router = useRouter();
  const { control, handleSubmit, formState, watch, setError, reset } =
    useForm<NewSalesSchemaType>({
      resolver: zodResolver(BaseSalesMutationSchema),
      defaultValues: {
        amount: 0,
        occurred_at: today(TIMEZONE).toDate(TIMEZONE),
      },
    });

  const occurredAt = watch("occurred_at");
  const productId = watch("product_id");

  const {
    data: getProducts,
    isFetching: isGetProductsFetching,
    isLoading: isGetProductsLoading,
    isPending: isGetProductsPending,
  } = useGetProducts({});

  const {
    data: availableSales,
    isLoading: isAvailableSalesLoading,
    isFetching: isAvailableFetching,
  } = useGetAvailableSalesCount(productId, occurredAt);

  const { mutateAsync, isPending } = useNewSales();

  const onSubmit = (data: NewSalesSchemaType) => {
    if (!availableSales) return;

    if (data.amount > availableSales) {
      setError("amount", {
        message: `Jumlah penjualan maksimal ${availableSales}`,
      });
      toast.error("Jumlah penjualan melebihi stok yang tersedia");
      return;
    }

    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: () => {
            reset();
            router.push("/sales");
          },
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
              isClearable: false,
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
              maxValue: today(TIMEZONE),
            }}
          />

          <div className="grid grid-cols-5 gap-x-4">
            <FormInputNumber
              control={control}
              name="amount"
              maxNumber={availableSales || 0}
              disabled={
                !availableSales ||
                !productId ||
                isAvailableFetching ||
                isAvailableSalesLoading
              }
              inputProps={{
                label: "Jumlah Penjualan",
                className: "col-span-3",
                isDisabled:
                  !availableSales ||
                  !productId ||
                  isAvailableSalesLoading ||
                  isAvailableFetching,
              }}
            />

            <Input
              className="col-span-2"
              label="Stok Tersedia"
              value={(!!productId
                ? formatNumber(availableSales ?? 0)
                : 0
              ).toString()}
              readOnly
            />
          </div>
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

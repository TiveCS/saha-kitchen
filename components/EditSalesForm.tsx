"use client";

import { getSalesById } from "@/actions/sales.action";
import { useGetProducts } from "@/queries/product.query";
import { useEditSales } from "@/queries/sales.query";
import { EditSalesSchema, EditSalesSchemaType } from "@/schemas/sales.schema";
import { GetProductsSingle } from "@/types/product.type";
import { PurchaseSystemAbbreviation } from "@/types/sales.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  Card,
  CardBody,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
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

interface EditSalesFormProps {
  id: string;
}

export function EditSalesForm({ id }: EditSalesFormProps) {
  const router = useRouter();

  const { control, handleSubmit, formState, reset, watch } =
    useForm<EditSalesSchemaType>({
      resolver: zodResolver(EditSalesSchema),
      defaultValues: async () => {
        const result = await getSalesById(id);

        return {
          id: result.id,
          amount: result.amount,
          occurred_at: new CalendarDate(
            result.occurredAt.getFullYear(),
            result.occurredAt.getMonth() + 1,
            result.occurredAt.getDate()
          ),
          purchase_system: result.purchaseSystem,
          product_id: result.productId,
        };
      },
    });

  const purchaseSystemValue = watch("purchase_system");
  const productIdValue = watch("product_id");

  const {
    data: getProducts,
    isFetching: isGetProductsFetching,
    isLoading: isGetProductsLoading,
    isPending: isGetProductsPending,
  } = useGetProducts({});

  const { mutateAsync, isPending } = useEditSales();

  const onSubmit = async (data: EditSalesSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: () => router.push("/sales"),
        });
        reset();
      },
      {
        loading: "Mengubah data penjualan...",
        success: "Data penjualan berhasil diubah",
        error: "Gagal mengubah data penjualan",
      }
    );
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        {formState.isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-14 rounded-lg bg-default-300" />

            <Skeleton className="h-14 rounded-lg bg-default-300" />

            <Skeleton className="h-14 rounded-lg bg-default-300" />

            <Skeleton className="h-14 rounded-lg bg-default-300" />

            <Skeleton className="h-10 rounded-lg bg-default-300" />
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormAutoComplete
              control={control}
              name="product_id"
              defaultValue=""
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
                selectedKey: productIdValue,
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

            <FormInputNumber
              control={control}
              name="amount"
              defaultValue={0}
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
                selectedKeys: [purchaseSystemValue],
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
                defaultValue: today(getLocalTimeZone()),
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
              Ubah Data Penjualan
            </Button>
          </form>
        )}
      </CardBody>
    </Card>
  );
}

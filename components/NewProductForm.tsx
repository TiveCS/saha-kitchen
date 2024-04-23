"use client";

import { useNewProduct } from "@/queries/product.query";
import {
  NewProductSchema,
  NewProductSchemaType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormInputNumber } from "./ui/FormInput";

export function NewProductForm() {
  const router = useRouter();
  const form = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      initial_stock: 0,
      minimum_stock: 0,
    },
  });

  const { mutateAsync, isPending } = useNewProduct();

  const onSubmit = async (data: NewProductSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data);
        form.reset();
        router.push("/products");
      },
      {
        loading: "Menambahkan produk...",
        success: "Produk berhasil ditambahkan",
        error: "Gagal menambahkan produk",
      }
    );
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            control={form.control}
            name="name"
            inputProps={{
              label: "Nama Produk",
            }}
          />

          <FormInputNumber
            control={form.control}
            name="price"
            inputProps={{
              label: "Harga Produk",
            }}
          />

          <div className="flex flex-row gap-x-4">
            <FormInputNumber
              control={form.control}
              name="minimum_stock"
              inputProps={{
                label: "Minimum Stok",
              }}
            />

            <FormInputNumber
              control={form.control}
              name="initial_stock"
              inputProps={{
                label: "Stok Saat Ini",
              }}
            />
          </div>

          <Button
            isLoading={
              isPending ||
              form.formState.isLoading ||
              form.formState.isSubmitting
            }
            color="primary"
            type="submit"
            fullWidth
          >
            Tambah Produk
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

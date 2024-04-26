"use client";

import { useEditProduct } from "@/queries/product.query";
import {
  EditProductSchema,
  EditProductSchemaType,
} from "@/schemas/product.schema";
import { GetProductByIdResult, ProductDetail } from "@/types/product.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormInputNumber } from "./ui/FormInput";

interface EditProductFormProps {
  product: ProductDetail;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();

  const form = useForm<EditProductSchemaType>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      price: product.price,
      minimum_stock: product.minimumStock,
    },
  });

  const { mutateAsync, isPending } = useEditProduct();

  const onSubmit = async (data: EditProductSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: () => router.push("/products"),
        });
        form.reset();
      },
      {
        loading: "Mengubah produk...",
        success: "Produk berhasil diubah",
        error: "Gagal mengubah produk",
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
            defaultValue=""
            inputProps={{
              label: "Nama Produk",
            }}
          />

          <FormInputNumber
            control={form.control}
            name="price"
            defaultValue={0}
            inputProps={{
              label: "Harga Produk",
            }}
          />

          <FormInputNumber
            control={form.control}
            name="minimum_stock"
            defaultValue={0}
            inputProps={{
              label: "Minimal Stok",
            }}
          />

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
            Ubah Produk
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

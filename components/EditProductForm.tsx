"use client";

import {
  useEditProduct,
  useGetProductByIdMutation,
} from "@/queries/product.query";
import {
  EditProductSchema,
  EditProductSchemaType,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormInputNumber } from "./ui/FormInput";
import { getProductById } from "@/actions/products.action";

interface EditProductFormProps {
  id: string;
}

export function EditProductForm({ id }: EditProductFormProps) {
  const router = useRouter();

  const form = useForm<EditProductSchemaType>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: async () => {
      const result = await getProductById(id);

      return {
        id: result.id,
        name: result.name,
        price: result.price,
        minimum_stock: result.minimumStock,
        // id: id,
        // name: "",
        // price: 0,
        // minimum_stock: 0,
      };
    },
  });

  const { mutateAsync, isPending } = useEditProduct();

  const onSubmit = async (data: EditProductSchemaType) => {
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

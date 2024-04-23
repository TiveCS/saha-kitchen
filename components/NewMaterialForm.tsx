"use client";

import {
  NewMaterialSchema,
  NewMaterialSchemaType,
} from "@/schemas/material.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { FormInput, FormInputNumber, FormInputSelect } from "./ui/FormInput";
import { MaterialUnit } from "@prisma/client";
import { toPascalCase } from "@/utils/string";
import { useNewMaterial } from "@/queries/material.query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NewMaterialForm() {
  const router = useRouter();
  const { control, formState, handleSubmit, reset } =
    useForm<NewMaterialSchemaType>({
      resolver: zodResolver(NewMaterialSchema),
      defaultValues: {
        name: "",
        initial_stock: 0,
        minimum_stock: 0,
      },
    });

  const { mutateAsync, isPending } = useNewMaterial();

  const onSubmit = async (data: NewMaterialSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: () => router.push("/materials"),
        });
        reset();
      },
      {
        loading: "Menambahkan bahan baku...",
        success: "Berhasil menambahkan bahan baku",
        error: "Gagal menambahkan bahan baku",
      }
    );
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            control={control}
            name="name"
            inputProps={{
              label: "Nama Bahan Baku",
            }}
          />

          <FormInputSelect
            control={control}
            name="unit"
            selectProps={{
              label: "Satuan Bahan Baku",
              placeholder: "Pilih Satuan Bahan Baku",
              children: Object.values(MaterialUnit).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {toPascalCase(unit)}
                </SelectItem>
              )),
            }}
          />

          <div className="flex flex-row gap-x-4">
            <FormInputNumber
              control={control}
              name="minimum_stock"
              inputProps={{
                label: "Minimum Stok",
              }}
            />

            <FormInputNumber
              control={control}
              name="initial_stock"
              inputProps={{
                label: "Stok Saat Ini",
              }}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            isLoading={
              isPending || formState.isSubmitting || formState.isLoading
            }
            fullWidth
          >
            Tambah Bahan Baku
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

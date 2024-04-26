"use client";

import { getMaterialById } from "@/actions/materials.action";
import { useEditMaterial } from "@/queries/material.query";
import {
  EditMaterialSchema,
  EditMaterialSchemaType,
} from "@/schemas/material.schema";
import { toPascalCase } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, SelectItem } from "@nextui-org/react";
import { MaterialUnit } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormInputNumber, FormInputSelect } from "./ui/FormInput";
import { MaterialDetail } from "@/types/material.type";

interface EditMaterialFormProps {
  material: MaterialDetail;
}

export function EditMaterialForm({ material }: EditMaterialFormProps) {
  const router = useRouter();

  const { control, formState, reset, handleSubmit, watch } =
    useForm<EditMaterialSchemaType>({
      resolver: zodResolver(EditMaterialSchema),
      defaultValues: {
        name: material.name,
        unit: material.unit,
        minimum_stock: material.minimumStock,
      },
    });

  const unitValue = watch("unit");

  const { mutateAsync, isPending } = useEditMaterial();

  const onSubmit = async (data: EditMaterialSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(
          { id: material.id, data },
          {
            onSuccess: () => router.push("/materials"),
          }
        );
        reset();
      },
      {
        loading: "Mengubah bahan baku...",
        success: "Bahan baku berhasil diubah",
        error: "Gagal mengubah bahan baku",
      }
    );
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            control={control}
            name="name"
            defaultValue=""
            inputProps={{
              label: "Nama Bahan Baku",
            }}
          />

          <FormInputSelect
            control={control}
            name="unit"
            defaultValue={undefined}
            selectProps={{
              label: "Satuan Bahan Baku",
              placeholder: "Pilih Satuan Bahan Baku",
              selectionMode: "single",
              selectedKeys: [unitValue],
              children: Object.values(MaterialUnit).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {toPascalCase(unit)}
                </SelectItem>
              )),
            }}
          />

          <FormInputNumber
            control={control}
            name="minimum_stock"
            defaultValue={0}
            inputProps={{
              label: "Minimum Stok",
            }}
          />

          <Button
            type="submit"
            color="primary"
            isLoading={
              isPending || formState.isSubmitting || formState.isLoading
            }
            fullWidth
          >
            Ubah Bahan Baku
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

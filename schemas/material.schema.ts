import { MaterialUnit } from "@prisma/client";
import { z } from "zod";

export const NewMaterialSchema = z.object({
  name: z.string().min(1, "Nama bahan baku tidak boleh kosong"),
  unit: z.nativeEnum(MaterialUnit, {
    invalid_type_error: "Satuan bahan baku tidak valid",
    required_error: "Satuan bahan baku tidak boleh kosong",
  }),
  minimum_stock: z
    .number({ required_error: "Stok minimum tidak boleh kosong" })
    .int("Stok minimum harus berupa bilangan bulat")
    .nonnegative("Stok minimum tidak boleh kurang dari 0"),
  initial_stock: z
    .number({ required_error: "Stok awal tidak boleh kosong" })
    .int("Stok awal harus berupa bilangan bulat")
    .nonnegative("Stok awal tidak boleh kurang dari 0"),
});

export const EditMaterialSchema = z.object({
  name: z.string().min(1, "Nama bahan baku tidak boleh kosong"),
  unit: z.nativeEnum(MaterialUnit, {
    invalid_type_error: "Satuan bahan baku tidak valid",
    required_error: "Satuan bahan baku tidak boleh kosong",
  }),
  minimum_stock: z
    .number({ required_error: "Stok minimum tidak boleh kosong" })
    .int("Stok minimum harus berupa bilangan bulat")
    .nonnegative("Stok minimum tidak boleh kurang dari 0"),
});

export type EditMaterialSchemaType = z.infer<typeof EditMaterialSchema>;
export type NewMaterialSchemaType = z.infer<typeof NewMaterialSchema>;

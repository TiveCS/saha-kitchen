import { getMaterials } from "@/actions/materials.action";
import { NarrowArray } from "@/utils/type";
import { MaterialUnit } from "@prisma/client";

export type GetMaterialsCount = Awaited<
  ReturnType<typeof getMaterials>
>["count"];
export type GetMaterialsMany = Awaited<
  ReturnType<typeof getMaterials>
>["materials"];
export type GetMaterialsSingle = NarrowArray<GetMaterialsMany>;

export const MaterialUnitAbbreviation: Record<MaterialUnit, string> = {
  KILOGRAM: "Kg",
  GRAM: "g",
  LITER: "L",
} as const;

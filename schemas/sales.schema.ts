import {
  CalendarDate,
  ZonedDateTime,
  getLocalTimeZone,
  isToday,
  today,
} from "@internationalized/date";
import { PurchaseSystem } from "@prisma/client";
import { z } from "zod";

export const BaseSalesMutationSchema = z.object({
  product_id: z
    .string()
    .min(1, "Produk ID tidak boleh kosong")
    .cuid("Produk ID tidak valid"),
  amount: z
    .number({ required_error: "Jumlah tidak boleh kosong" })
    .nonnegative("Jumlah tidak boleh negatif"),
  purchase_system: z.nativeEnum(PurchaseSystem, {
    invalid_type_error: "Sistem pembelian tidak valid",
    required_error: "Sistem pembelian tidak boleh kosong",
  }),
  occurred_at: z.date({
    required_error: "Tanggal penjualan tidak boleh kosong",
  }),
});

export const BaseSalesMutationActionSchema = BaseSalesMutationSchema.extend({
  occurred_at: z
    .date()
    .max(today(getLocalTimeZone()).toDate(getLocalTimeZone()), {
      message: "Tanggal penjualan maksimal hari ini",
    }),
});

export const EditSalesSchema = BaseSalesMutationSchema.extend({
  id: z.string().cuid("ID penjualan tidak valid"),
});

export const EditSalesActionSchema = BaseSalesMutationActionSchema.extend({
  id: z.string().cuid("ID penjualan tidak valid"),
});

export type NewSalesSchemaType = z.infer<typeof BaseSalesMutationSchema>;
export type EditSalesSchemaType = z.infer<typeof EditSalesSchema>;

export type NewSalesActionSchemaType = z.infer<
  typeof BaseSalesMutationActionSchema
>;
export type EditSalesActionSchemaType = z.infer<typeof EditSalesActionSchema>;

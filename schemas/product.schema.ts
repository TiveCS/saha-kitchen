import { z } from "zod";

export const NewProductSchema = z.object({
  name: z.string().min(1, "Nama produk diperlukan"),
  price: z.number().positive("Harga produk harus lebih dari 0"),
  minimum_stock: z.number().nonnegative("Minimum stok tidak boleh negatif"),
  initial_stock: z.number().nonnegative("Stok saat ini tidak boleh negatif"),
});

export const EditProductSchema = NewProductSchema.omit({
  initial_stock: true,
}).extend({
  id: z.string().min(1, "ID produk diperlukan"),
});

export type NewProductSchemaType = z.infer<typeof NewProductSchema>;
export type EditProductSchemaType = z.infer<typeof EditProductSchema>;

export const NewProductStockHistorySchema = z.object({
  product_id: z.string().cuid(),
  current_stock: z.number().nonnegative(),
});

export const EditProductStockHistorySchema = NewProductStockHistorySchema.omit({
  product_id: true,
}).extend({ id: z.string().cuid() });

export type NewProductStockHistorySchemaType = z.infer<
  typeof NewProductStockHistorySchema
>;

export type EditProductStockHistorySchemaType = z.infer<
  typeof EditProductStockHistorySchema
>;

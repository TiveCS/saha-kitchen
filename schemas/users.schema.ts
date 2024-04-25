import { UserRole } from "@prisma/client";
import { z } from "zod";

export const EditUserSchema = z
  .object({
    id: z.number().positive(),
    name: z.string().min(1, "Nama tidak boleh kosong"),
    username: z.string().min(1, "Username tidak boleh kosong"),
    password: z
      .string({ required_error: "Password tidak boleh kosong" })
      .optional(),
    confirmPassword: z
      .string({ required_error: "Konfirm password tidak boleh kosong" })
      .optional(),
    role: z.nativeEnum(UserRole),
  })
  .refine(
    ({ password, confirmPassword }) => {
      if (!password && !confirmPassword) return true;
      return password === confirmPassword;
    },
    {
      message: "Password dan konfirmasi password tidak sama",
      path: ["confirmPassword"],
    }
  );

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;

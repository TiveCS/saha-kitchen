import { UserRole } from "@prisma/client";
import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi password tidak boleh kosong"),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export const SignInResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  role: z.nativeEnum(UserRole),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type SignInResponseSchemaType = z.infer<typeof SignInResponseSchema>;

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SignInSchemaType, SignUpSchemaType } from "@/schemas/auth.schema";
import { Prisma, UserRole } from "@prisma/client";
import * as argon2 from "argon2";
import { getHasUser } from "./users.action";
import { revalidatePath } from "next/cache";

export async function signUpAction({
  name,
  username,
  password,
  role,
}: SignUpSchemaType) {
  const session = await auth();
  const hasUser = await getHasUser();

  if (hasUser && (!session || session.user.role !== UserRole.ADMIN)) {
    throw new Error("Anda tidak memiliki akses untuk membuat user");
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    throw new Error("Username sudah digunakan");
  }

  const hashedPassword = await argon2.hash(password);

  try {
    await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
      },
      select: { id: true, username: true, role: true },
    });

    revalidatePath("/login");

    return "User created successfully";
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message + ". Code: " + error.code);
    }
    return "Error: Unhandled";
  }
}

export async function signInAction({ username, password }: SignInSchemaType) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const isValidPassword = await argon2.verify(user.password, password);

  if (!isValidPassword) {
    throw new Error("Password salah");
  }

  return user;
}

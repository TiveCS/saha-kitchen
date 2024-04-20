"use server";

import prisma from "@/lib/prisma";
import { SignInSchemaType, SignUpSchemaType } from "@/schemas/auth.schema";
import { Prisma } from "@prisma/client";
import * as argon2 from "argon2";

export async function signUpAction({
  name,
  username,
  password,
  role,
}: SignUpSchemaType) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user) {
    throw new Error("User already exists");
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

    return "User created successfully";
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        "User creation failed. Error: " + error.code + " , " + error.message
      );
    }
    return "User creation failed. Error: Unhandled";
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

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { EditUserSchemaType } from "@/schemas/users.schema";
import { Prisma, UserRole } from "@prisma/client";
import * as argon2 from "argon2";
import { notFound, redirect } from "next/navigation";

export async function getUsers(args?: { page?: number; take?: number }) {
  const session = await auth();

  if (!session) return redirect("/login");

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak memiliki akses untuk melihat data user");
  }

  const pageFirstIndex =
    args?.page && args?.take ? (args.page - 1) * args.take : 0;

  const [count, foundUsers] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
      skip: pageFirstIndex,
      take: args?.take,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      },
    }),
  ]);

  const users = foundUsers.map((user, index) => ({
    ...user,
    index: pageFirstIndex + index + 1,
  }));

  return { count, users };
}

export async function deleteUser(id: number) {
  const session = await auth();

  if (!session) return redirect("/login");

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak memiliki akses untuk menghapus user");
  }

  const user = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
    },
  });

  return user;
}

export async function editUser(data: EditUserSchemaType) {
  const session = await auth();

  if (!session) return redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isSameUser = session.user.id === data.id;

  if (!isSameUser && !isAdmin) {
    throw new Error("Anda tidak memiliki akses untuk mengedit user");
  }

  try {
    const user = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        username: data.username,
        role: data.role,
        password: data.password ? await argon2.hash(data.password) : undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Username sudah digunakan");
      }

      if (error.code === "P2020") {
        throw new Error("User tidak ditemukan");
      }
    }
    throw error;
  }
}

export async function getUserById(id: number) {
  const session = await auth();

  if (!session) return redirect("/login");

  const isAdmin = session.user.role === UserRole.ADMIN;
  const isSameUser = session.user.id === id;

  if (!isSameUser && !isAdmin) {
    throw new Error("Anda tidak memiliki akses untuk melihat data user");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
    },
  });

  return user;
}

"use client";

import { getMaterialById } from "@/actions/materials.action";
import { useEditMaterial } from "@/queries/material.query";
import {
  EditMaterialSchema,
  EditMaterialSchemaType,
} from "@/schemas/material.schema";
import { toPascalCase } from "@/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import { MaterialUnit, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormInputNumber, FormInputSelect } from "./ui/FormInput";
import { EditUserSchema, EditUserSchemaType } from "@/schemas/users.schema";
import { getUserById } from "@/actions/users.action";
import { useEditUser } from "@/queries/users.query";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { GetUsersSingle } from "@/types/users.type";

interface EditUserFormProps {
  user: Awaited<ReturnType<typeof getUserById>>;
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const session = useSession();
  const { control, formState, reset, handleSubmit, watch } =
    useForm<EditUserSchemaType>({
      resolver: zodResolver(EditUserSchema),
      defaultValues: {
        id: user?.id,
        name: user?.name || "",
        username: user?.username || "",
        role: user?.role || "STAFF",
        password: "",
        confirmPassword: "",
      },
    });

  const roleValue = watch("role");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useEditUser();

  const onSubmit = async (data: EditUserSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: async () => {
            await session.update({ name: data.name });
            router.push("/users");
          },
        });
        reset();
      },
      {
        loading: "Mengubah user...",
        success: "User berhasil diubah",
        error: "Gagal mengubah user",
      }
    );
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        {formState.isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 bg-default-300 rounded-lg" />
            <Skeleton className="h-12 bg-default-300 rounded-lg" />
            <Skeleton className="h-12 bg-default-300 rounded-lg" />
            <Skeleton className="h-12 bg-default-300 rounded-lg" />
            <Skeleton className="h-12 bg-default-300 rounded-lg" />
            <Skeleton className="h-10 bg-default-300 rounded-lg" />
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              control={control}
              name="name"
              inputProps={{
                label: "Nama User",
              }}
            />

            {session.data?.user.role === UserRole.ADMIN && (
              <FormInputSelect
                control={control}
                name="role"
                selectProps={{
                  label: "Role",
                  selectedKeys: [roleValue],
                  children: Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {toPascalCase(role)}
                    </SelectItem>
                  )),
                }}
              />
            )}

            <FormInput
              control={control}
              name="username"
              inputProps={{
                label: "Username",
                autoComplete: "username",
              }}
            />

            <FormInput
              control={control}
              name="password"
              inputProps={{
                label: "Password",
                type: showPassword ? "text" : "password",
                autoComplete: "new-password",
                endContent: (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                ),
              }}
            />

            <FormInput
              control={control}
              name="confirmPassword"
              inputProps={{
                label: "Konfirmasi Password",
                type: showPassword ? "text" : "password",
                autoComplete: "new-password",
                endContent: (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                ),
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
              Ubah User
            </Button>
          </form>
        )}
      </CardBody>
    </Card>
  );
}

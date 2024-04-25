"use client";

import { SignUpSchema, SignUpSchemaType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput, FormInputSelect } from "./ui/FormInput";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { UserRole } from "@prisma/client";
import { toPascalCase } from "@/utils/string";
import { signUpAction } from "@/actions/auth.action";
import { useNewUser } from "@/queries/users.query";

export function NewUserForm() {
  const router = useRouter();
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      confirmPassword: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useNewUser();

  const onSubmit = async (data: SignUpSchemaType) => {
    toast.promise(
      async () => {
        await mutateAsync(data, {
          onSuccess: () => {
            form.reset();
            router.push("/users");
          },
        });
      },
      {
        loading: "Menambahkan user...",
        success: "User berhasil ditambahkan",
        error: "Gagal menambahkan user",
      }
    );
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="max-w-sm">
      <CardBody>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            control={form.control}
            name="name"
            inputProps={{
              label: "Nama User",
            }}
          />

          <FormInputSelect
            control={form.control}
            name="role"
            selectProps={{
              label: "Role",
              children: Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {toPascalCase(role)}
                </SelectItem>
              )),
            }}
          />

          <FormInput
            control={form.control}
            name="username"
            inputProps={{
              label: "Username",
              autoComplete: "username",
            }}
          />

          <FormInput
            control={form.control}
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
            control={form.control}
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
            isLoading={
              isPending ||
              form.formState.isLoading ||
              form.formState.isSubmitting
            }
            color="primary"
            type="submit"
            fullWidth
          >
            Tambah User
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

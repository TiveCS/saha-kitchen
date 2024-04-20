"use client";

import { SignInSchema, SignInSchemaType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "./ui/FormInput";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchemaType) => {
    await signIn("credentials", {
      ...data,
      callbackUrl: "/products",
    });
  };

  return (
    <Card className="max-w-sm">
      <CardBody>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            control={control}
            name="username"
            inputProps={{
              label: "Username",
            }}
          />

          <FormInput
            control={control}
            name="password"
            inputProps={{
              label: "Password",
              type: showPassword ? "text" : "password",
              endContent: (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeSlash className="w-4 h-4" />
                  )}
                </button>
              ),
            }}
          />

          <Button
            isLoading={formState.isLoading || formState.isSubmitting}
            type="submit"
            color="primary"
            fullWidth
          >
            Masuk
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

"use client";

import {
  handleNumericInputChange,
  handleNumericInputDisplay,
} from "@/utils/form";
import { Input, InputProps } from "@nextui-org/react";
import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  inputProps?: InputProps;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ inputProps, ...props }: FormInputProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return (
          <Input
            {...field}
            isDisabled={formState.isSubmitting || formState.isLoading}
            onValueChange={field.onChange}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            {...inputProps}
          />
        );
      }}
    />
  );
}

export function FormInputNumber<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ inputProps, ...props }: FormInputProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return (
          <Input
            ref={field.ref}
            value={handleNumericInputDisplay(field.value)}
            onValueChange={(v) => field.onChange(handleNumericInputChange(v))}
            onBlur={field.onBlur}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            isDisabled={formState.isSubmitting || formState.isLoading}
            {...inputProps}
          />
        );
      }}
    />
  );
}

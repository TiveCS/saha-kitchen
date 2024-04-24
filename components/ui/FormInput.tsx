"use client";

import {
  handleNumericInputChange,
  handleNumericInputDisplay,
} from "@/utils/form";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  DatePicker,
  DatePickerProps,
  Input,
  InputProps,
  Select,
  SelectProps,
} from "@nextui-org/react";
import { CalendarDots } from "@phosphor-icons/react";
import { ReactNode } from "react";
import {
  Controller,
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  inputProps?: InputProps;
}

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  selectProps: SelectProps;
}

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  datePickerProps: DatePickerProps;
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
            isDisabled={
              field.disabled || formState.isSubmitting || formState.isLoading
            }
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
            isDisabled={
              field.disabled || formState.isSubmitting || formState.isLoading
            }
            {...inputProps}
          />
        );
      }}
    />
  );
}

export function FormInputSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ selectProps, ...props }: FormSelectProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return (
          <Select
            {...field}
            isDisabled={
              field.disabled || formState.isSubmitting || formState.isLoading
            }
            isLoading={formState.isLoading}
            value={field.value}
            onSelectionChange={field.onChange}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            {...selectProps}
          />
        );
      }}
    />
  );
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ datePickerProps, ...props }: FormDatePickerProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return (
          <DatePicker
            {...field}
            ref={field.ref}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            selectorIcon={<CalendarDots />}
            isDisabled={
              field.disabled || formState.isSubmitting || formState.isLoading
            }
            {...datePickerProps}
          />
        );
      }}
    />
  );
}

interface FormAutoCompleteProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  processItem: (item: object) => {
    key: string;
    label: ReactNode;
    value: any;
  };
  autoCompleteProps: Omit<AutocompleteProps, "children">;
}

export function FormAutoComplete<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ processItem, ...props }: FormAutoCompleteProps<TFieldValues, TName>) {
  const { items, ...autoCompleteProps } = props.autoCompleteProps;
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return (
          <Autocomplete
            {...field}
            isDisabled={
              field.disabled || formState.isSubmitting || formState.isLoading
            }
            isLoading={formState.isLoading}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            onSelectionChange={field.onChange}
            value={field.value}
            items={items}
            {...autoCompleteProps}
          >
            {(item) => {
              0;
              const processedItem = processItem(item);
              return (
                <AutocompleteItem
                  key={processedItem.key}
                  value={processedItem.value}
                >
                  {processedItem.label}
                </AutocompleteItem>
              );
            }}
          </Autocomplete>
        );
      }}
    />
  );
}

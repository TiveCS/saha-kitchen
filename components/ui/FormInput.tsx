"use client";

import { TIMEZONE } from "@/constants";
import {
  handleNumericInputChange,
  handleNumericInputDisplay,
} from "@/utils/form";
import { parseAbsolute, toCalendarDate } from "@internationalized/date";
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
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  UseFormStateReturn,
} from "react-hook-form";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  inputProps?: InputProps;
  maxNumber?: number;
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
>({ inputProps, maxNumber, ...props }: FormInputProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return (
          <Input
            ref={field.ref}
            value={handleNumericInputDisplay(field.value)}
            onValueChange={(v) => {
              let num = handleNumericInputChange(v);

              if (maxNumber && num > maxNumber) {
                num = maxNumber;
              }

              field.onChange(num);
            }}
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

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  selectProps: SelectProps;
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

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  datePickerProps:
    | DatePickerProps
    | (({
        field,
        fieldState,
        formState,
      }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
      }) => DatePickerProps);
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ datePickerProps, ...props }: FormDatePickerProps<TFieldValues, TName>) {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        datePickerProps =
          typeof datePickerProps === "function"
            ? datePickerProps({ field, fieldState, formState })
            : datePickerProps;

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
            onChange={(value) => field.onChange(value.toDate(TIMEZONE))}
            value={
              field.value
                ? toCalendarDate(
                    parseAbsolute(
                      (field.value as unknown as Date).toISOString(),
                      TIMEZONE
                    )
                  )
                : undefined
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

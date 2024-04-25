"use client";

import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/table";
import { Key, ReactNode, useState } from "react";
import { Pagination } from "./Pagination";
import { formatNumber } from "@/utils/formatter";
import { TableProps } from "@nextui-org/react";

type InputDataKeys = {
  key: string;
  label: string;
};

export type DataTableHandleCellValueArgs<TData> = {
  key: Key;
  item: TData;
  value: any;
};

interface DataTableProps<TData extends Record<string, any>> extends TableProps {
  items: TData[] | undefined;
  count?: number;
  columns: InputDataKeys[];
  page?: number;
  setPage?: (page: number) => void;
  onRowAction?: (key: Key) => void;
  href?: string;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
  isLoading?: boolean;
  rowKey: (item: TData) => Key;
  handleCellValue?: (args: DataTableHandleCellValueArgs<TData>) => any;
}

export function DataTable<TData extends Record<string, any>>({
  columns,
  items,
  count = 0,
  onRowAction,
  page,
  setPage,
  emptyContent,
  errorContent,
  isLoading,
  rowKey,
  handleCellValue = ({ key, item, value }) =>
    typeof value === "number" ? formatNumber(value) : value,
  ...props
}: DataTableProps<TData>) {
  return (
    <Table
      isHeaderSticky
      aria-label="Tabel Daftar Produk"
      selectionMode="single"
      onRowAction={onRowAction}
      classNames={{
        wrapper: "max-h-96",
      }}
      bottomContentPlacement="outside"
      bottomContent={
        page &&
        setPage && (
          <Pagination
            page={page}
            setPage={setPage}
            count={count}
            rowsPerPage={6}
          />
        )
      }
      {...props}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key as string}>{column.label}</TableColumn>
        )}
      </TableHeader>

      <TableBody
        items={items || []}
        emptyContent={errorContent || emptyContent}
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={rowKey(item)}>
            {(columnKey) => {
              let value = getKeyValue(item, columnKey);

              if (handleCellValue) {
                value = handleCellValue({ key: columnKey, item, value });
              }

              return <TableCell>{value}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

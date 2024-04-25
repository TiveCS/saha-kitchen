"use client";

import { useGetUsers } from "@/queries/users.query";
import { DataTable, DataTableHandleCellValueArgs } from "./ui/DataTable";
import { useState } from "react";
import { GetUsersSingle } from "@/types/users.type";
import { formatNumber } from "@/utils/formatter";
import { UsersTableCellAction } from "./UsersTableCellAction";
import { Chip, useDisclosure } from "@nextui-org/react";
import { UserDeleteModal } from "./UserDeleteModal";
import { UserRole } from "@prisma/client";
import { toPascalCase } from "@/utils/string";

type UserKeys = keyof GetUsersSingle | "action";

export function UsersTable() {
  const [page, setPage] = useState(1);

  const columns: { key: UserKeys; label: string }[] = [
    {
      key: "index",
      label: "NO",
    },
    {
      key: "name",
      label: "NAMA",
    },
    {
      key: "username",
      label: "USERNAME",
    },
    {
      key: "role",
      label: "ROLE",
    },
    {
      key: "action",
      label: "AKSI",
    },
  ];

  const { data, error, isPending, isLoading } = useGetUsers({ page, take: 6 });

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onOpenChange: onDeleteDialogOpenChange,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [deleteSelectedUser, setDeleteSelectedUser] =
    useState<GetUsersSingle | null>(null);

  const handleRowValue = ({
    item,
    key,
    value,
  }: DataTableHandleCellValueArgs<GetUsersSingle>): any => {
    if (typeof value === "number") value = formatNumber(value);

    if (key === "action") {
      return (
        <UsersTableCellAction
          item={item}
          openDeleteDialog={openDeleteDialog}
          setDeleteSelectedUser={setDeleteSelectedUser}
        />
      );
    }

    if (key === "role") {
      return (
        <Chip
          variant="flat"
          color={(value as UserRole) === UserRole.ADMIN ? "danger" : "primary"}
          size="sm"
        >
          {toPascalCase(value)}
        </Chip>
      );
    }

    return value;
  };

  return (
    <>
      <UserDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onOpenChange={onDeleteDialogOpenChange}
        user={deleteSelectedUser}
        setUser={setDeleteSelectedUser}
      />

      <DataTable
        columns={columns}
        items={data?.users}
        count={data?.count}
        page={page}
        setPage={setPage}
        emptyContent={"Tidak ada user yang ditemukan."}
        errorContent={error?.message}
        isLoading={isPending || isLoading}
        handleCellValue={handleRowValue}
        selectionMode="none"
        rowKey={(item) => item.id}
        classNames={{
          wrapper: "max-h-96",
        }}
      />
    </>
  );
}

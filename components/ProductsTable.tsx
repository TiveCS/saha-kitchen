"use client";

import { useGetProducts } from "@/queries/product.query";
import { GetProductsSingle, StockStatus } from "@/types/product.type";
import { formatNumber } from "@/utils/formatter";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/table";
import { DotsThreeVertical, Warning } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "./ui/Pagination";
import { ProductDeleteModal } from "./ProductDeleteModal";

type ProductKeys = keyof GetProductsSingle | "action";

interface ProductsTableProps {}

export function ProductsTable({}: ProductsTableProps) {
  const router = useRouter();
  const columns: { key: ProductKeys; label: string }[] = [
    {
      key: "index",
      label: "NO",
    },
    {
      key: "name",
      label: "NAMA PRODUK",
    },
    {
      key: "minimumStock",
      label: "STOK MINIMUM",
    },
    {
      key: "stock",
      label: "STOK SAAT INI",
    },
    {
      key: "price",
      label: "HARGA SATUAN (Rp)",
    },
    {
      key: "asset",
      label: "TOTAL ASET (Rp)",
    },
    {
      key: "stockStatus",
      label: "STATUS",
    },
    {
      key: "action",
      label: "AKSI",
    },
  ];

  const [page, setPage] = useState(1);

  const { data, isLoading, isPending, error } = useGetProducts({ page });

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onOpenChange: onDeleteDialogOpenChange,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [deleteSelectedProduct, setDeleteSelectedProduct] =
    useState<GetProductsSingle | null>(null);

  return (
    <>
      <ProductDeleteModal
        product={deleteSelectedProduct}
        setProduct={setDeleteSelectedProduct}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onOpenChange={onDeleteDialogOpenChange}
      />

      <Table
        isHeaderSticky
        aria-label="Tabel Daftar Produk"
        selectionMode="single"
        onRowAction={(key) => {
          router.push(`/products/${key}`);
        }}
        classNames={{
          wrapper: "max-h-96",
        }}
        bottomContentPlacement="outside"
        bottomContent={
          <Pagination
            page={page}
            setPage={setPage}
            count={data?.count}
            rowsPerPage={6}
          />
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={data?.products || []}
          emptyContent={error?.message || "Tidak ada produk yang ditemukan."}
          isLoading={isPending || isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => {
                let value = getKeyValue(item, columnKey);

                if (typeof value === "number") value = formatNumber(value);

                if (columnKey === "stockStatus") {
                  const stockStatus = value as GetProductsSingle["stockStatus"];
                  const isOk = stockStatus === StockStatus.OK;
                  value = (
                    <Chip
                      size="sm"
                      color={isOk ? "success" : "warning"}
                      variant="flat"
                    >
                      {isOk ? "Stok OK" : "Restock"}
                    </Chip>
                  );
                }

                if (columnKey === "action") {
                  value = (
                    <div className="relative flex justify-start items-center gap-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button size="sm" isIconOnly variant="light">
                            <DotsThreeVertical className="w-6 h-6" />
                          </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                          aria-label="Aksi Baris Produk"
                          onAction={(key) => {
                            if (key === "delete") {
                              setDeleteSelectedProduct(item);
                              openDeleteDialog();
                            }
                          }}
                        >
                          <DropdownItem href={`/products/${item.id}`}>
                            Detail
                          </DropdownItem>
                          <DropdownItem href={`/products/${item.id}/edit`}>
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            key={"delete"}
                            className="text-danger"
                            color="danger"
                          >
                            Hapus
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  );
                }

                return <TableCell>{value}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

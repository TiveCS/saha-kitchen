"use client";

import { GetProductsMany } from "@/types/product.type";
import {
  Chip,
  Select,
  SelectItem,
  SelectedItems,
  Selection,
} from "@nextui-org/react";

interface AnalyticsProductSelectorProps {
  products: GetProductsMany;
  selectedProducts: Selection;
  setSelectedProducts: (selected: Selection) => void;
}

export function AnalyticsProductSelector({
  products,
  selectedProducts,
  setSelectedProducts,
}: AnalyticsProductSelectorProps) {
  return (
    <>
      <Select
        items={products}
        label="Pilihan Analisis Produk"
        placeholder="Pilih produk yang ingin dianalisis"
        selectedKeys={selectedProducts}
        onSelectionChange={setSelectedProducts}
        selectionMode="multiple"
        size="sm"
        isMultiline
        classNames={{
          base: "max-w-md",
          trigger: "bg-background shadow-small",
          label: "pb-2",
        }}
        renderValue={(selected: SelectedItems) => (
          <div className="inline-flex flex-wrap gap-2">
            {selected.map((item) => {
              const product = products.find(
                (p) => p.id === item.key?.toString()
              );
              return (
                <Chip key={item.key} size="sm">
                  {product?.name}
                </Chip>
              );
            })}
          </div>
        )}
      >
        {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
      </Select>
    </>
  );
}

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
        isMultiline
        onSelectionChange={setSelectedProducts}
        selectionMode="multiple"
        className="max-w-md"
        variant="bordered"
        renderValue={(selected: SelectedItems) => (
          <div className="flex flex-wrap gap-2">
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

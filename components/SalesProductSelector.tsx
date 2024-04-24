"use client";

import { getSales } from "@/actions/sales.action";
import { GetProductsMany, GetProductsSingle } from "@/types/product.type";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface SalesProductSelectorProps {
  products: GetProductsMany;
  productId: string | null;
  setProductId: (productId: string | null) => void;
}

export function SalesProductSelector({
  products,
  setProductId,
  productId,
}: SalesProductSelectorProps) {
  return (
    <Autocomplete
      label="Produk"
      placeholder="Pilih produk"
      items={products}
      className="max-w-sm"
      variant="bordered"
      isDisabled={products.length === 0}
      isClearable={false}
      defaultSelectedKey={productId ?? undefined}
      onSelectionChange={(productId) => {
        if (productId) setProductId(productId.toString());
      }}
    >
      {(item) => (
        <AutocompleteItem key={item.id} value={item.id}>
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

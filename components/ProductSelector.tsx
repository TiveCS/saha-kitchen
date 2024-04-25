"use client";

import { GetProductsMany } from "@/types/product.type";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface ProductSelectorProps {
  products: GetProductsMany;
  productId: string | null;
  setProductId: (productId: string | null) => void;
}

export function ProductSelector({
  products,
  setProductId,
  productId,
}: ProductSelectorProps) {
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

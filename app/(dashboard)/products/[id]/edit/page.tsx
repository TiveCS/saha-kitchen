import { EditProductForm } from "@/components/EditProductForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Data Produk",
            href: "/products",
          },
          {
            label: "Detail Produk",
            href: `/products/${params.id}`,
          },
          {
            label: "Ubah Produk",
            href: `/products/${params.id}/edit`,
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href={`/products/${params.id}`}
        >
          Kembali
        </Button>

        <EditProductForm id={params.id} />
      </section>
    </>
  );
}

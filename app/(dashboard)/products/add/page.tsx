import { newProduct } from "@/actions/products.action";
import { NewProductForm } from "@/components/NewProductForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export default async function ProductAddPage() {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Data Produk",
            href: "/products",
          },
          {
            label: "Tambah Produk",
            href: "/products/add",
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href="/products"
        >
          Kembali
        </Button>

        <NewProductForm />
      </section>
    </>
  );
}

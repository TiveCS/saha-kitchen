import { NewSalesForm } from "@/components/NewSalesForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function NewSalesPage() {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Data Penjualan",
            href: "/sales",
          },
          {
            label: "Tambah Data Penjualan",
            href: "/sales/add",
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href="/sales"
        >
          Kembali
        </Button>

        <NewSalesForm />
      </section>
    </>
  );
}

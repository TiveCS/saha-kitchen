import { EditSalesForm } from "@/components/EditSalesForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export default async function EditSalesPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Data Penjualan",
            href: "/sales",
          },
          {
            label: "Ubah Penjualan",
            href: `/sales/${params.id}/edit`,
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href={`/sales`}
        >
          Kembali
        </Button>

        <EditSalesForm id={params.id} />
      </section>
    </>
  );
}

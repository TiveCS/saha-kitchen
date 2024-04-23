import { NewMaterialForm } from "@/components/NewMaterialForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export default async function NewMaterialPage() {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            href: "/materials",
            label: "Data Bahan Baku",
          },
          {
            href: "/materials/add",
            label: "Tambah Bahan Baku",
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href="/materials"
        >
          Kembali
        </Button>

        <NewMaterialForm />
      </section>
    </>
  );
}

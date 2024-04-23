import { MaterialsTable } from "@/components/MaterialsTable";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export default async function MaterialsPage() {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            href: "/materials",
            label: "Data Bahan Baku",
          },
        ]}
      />

      <section className="flex-1 flex flex-col w-full px-8 py-4 gap-y-6">
        <header className="flex flex-row-reverse">
          <Button
            as={Link}
            href="/materials/add"
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
          >
            Tambah Bahan Baku
          </Button>
        </header>

        <MaterialsTable />
      </section>
    </>
  );
}

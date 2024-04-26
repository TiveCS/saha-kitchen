import { getMaterialById } from "@/actions/materials.action";
import { EditMaterialForm } from "@/components/EditMaterialForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

export default async function EditMaterialPage({
  params,
}: {
  params: { id: string };
}) {
  const material = await getMaterialById(params.id);

  if (!material) return notFound();

  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Data Bahan Baku",
            href: "/materials",
          },
          {
            label: "Detail Bahan Baku",
            href: `/materials/${params.id}`,
          },
          {
            label: "Ubah Bahan Baku",
            href: `/materials/${params.id}/edit`,
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href={`/materials/${params.id}`}
        >
          Kembali
        </Button>

        <EditMaterialForm material={material} />
      </section>
    </>
  );
}

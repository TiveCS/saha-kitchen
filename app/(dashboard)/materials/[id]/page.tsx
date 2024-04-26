import { getMaterialById } from "@/actions/materials.action";
import { MaterialDetailTabs } from "@/components/MaterialDetailTabs";
import { NewMaterialStockHistoryModal } from "@/components/NewMaterialStockHistoryModal";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function MaterialDetailPage({
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
            href: "/materials",
            label: "Data Bahan Baku",
          },
          {
            href: `/materials/${params.id}`,
            label: "Detail Bahan Baku",
          },
        ]}
      />

      <section className="flex-1 flex flex-col px-8 py-4 gap-y-6 space-y-8">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href={`/materials`}
          className="w-fit"
        >
          Kembali
        </Button>

        <div className="w-full flex-1 flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-x-6">
              <Card className="w-fit mb-6">
                <CardHeader>
                  <h4 className="font-medium">{material.name}</h4>
                </CardHeader>
                <CardBody>
                  <p className="text-small">
                    Dibuat pada: {formatReadableDate(material.createdAt)}
                  </p>
                </CardBody>
              </Card>

              <Card className="w-fit mb-6">
                <CardHeader>
                  <h4 className="font-medium">Status Stok</h4>
                </CardHeader>
                <CardBody>
                  <p className="text-small">
                    {formatNumber(
                      material.stockHistories[0]?.currentStock ?? 0
                    )}{" "}
                    dari {formatNumber(material.minimumStock)} {" stok minimum"}
                  </p>
                </CardBody>
              </Card>
            </div>

            <NewMaterialStockHistoryModal materialId={material.id} />
          </div>

          <MaterialDetailTabs material={material} />
        </div>
      </section>
    </>
  );
}

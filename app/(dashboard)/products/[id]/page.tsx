import { getProductById } from "@/actions/products.action";
import { EditProductStockHistoryModal } from "@/components/EditProductStockHistoryModal";
import { NewProductStockHistoryModal } from "@/components/NewProductStockHistoryModal";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) return notFound();

  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            href: "/products",
            label: "Data Produk",
          },
          {
            href: `/products/${params.id}`,
            label: "Detail Produk",
          },
        ]}
      />

      <section className="flex-1 flex flex-col px-8 py-4 gap-y-6 space-y-8">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href={`/products`}
          className="w-fit"
        >
          Kembali
        </Button>

        <div className="w-full flex-1 flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-x-6">
              <Card className="w-fit mb-6">
                <CardHeader>
                  <h4 className="font-medium">{product.name}</h4>
                </CardHeader>
                <CardBody>
                  <p className="text-small">
                    Dibuat pada: {formatReadableDate(product.createdAt)}
                  </p>
                </CardBody>
              </Card>

              <Card className="w-fit mb-6">
                <CardHeader>
                  <h4 className="font-medium">Status Stok</h4>
                </CardHeader>
                <CardBody>
                  <p className="text-small">
                    {formatNumber(product.stockHistories[0]?.currentStock ?? 0)}{" "}
                    dari {formatNumber(product.minimumStock)} {" stok minimum"}
                  </p>
                </CardBody>
              </Card>
            </div>

            <NewProductStockHistoryModal productId={product.id} />
          </div>

          <ProductDetailTabs product={product} />
        </div>
      </section>
    </>
  );
}

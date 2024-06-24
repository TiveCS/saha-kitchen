import { getProductById } from "@/actions/products.action";
import { getTotalSalesUntilDate } from "@/actions/sales.action";
import { getCumulativeProductStockAtDate } from "@/actions/stock.action";
import { NewProductStockHistoryModal } from "@/components/NewProductStockHistoryModal";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { TIMEZONE } from "@/constants";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { formatNumber, formatReadableDate } from "@/utils/formatter";
import { today } from "@internationalized/date";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  const totalSales = await getTotalSalesUntilDate(params.id);
  const getStock = await getCumulativeProductStockAtDate(params.id);

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

      <section className="flex-1 flex flex-col px-8 py-4">
        <div>
          <Button
            as={Link}
            startContent={<CaretLeft className="w-4 h-4" />}
            variant="ghost"
            href={`/products`}
            size="sm"
            className="w-fit"
          >
            Kembali
          </Button>
        </div>

        <div className="my-6">
          <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
          <Divider />
        </div>

        <div className="w-full flex-1 flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <div className="grid grid-cols-2 gap-x-4">
              <Card className="mb-6">
                <CardBody>
                  <h4 className="font-medium mb-2 text-sm">Total Penjualan</h4>

                  <p className="font-semibold text-lg">
                    {formatNumber(totalSales)}
                  </p>

                  <p className="text-small">
                    per {formatReadableDate(today(TIMEZONE).toDate(TIMEZONE))}
                  </p>
                </CardBody>
              </Card>

              <Card className="mb-6">
                <CardBody>
                  <h4 className="font-medium mb-2 text-sm">Status Stok</h4>

                  <Tooltip
                    content={
                      <div className="space-y-2 min-w-48">
                        <div className="flex flex-col">
                          <div className="flex flex-row justify-between">
                            <p className="font-semibold">Total Stok</p>
                            <p>{formatNumber(getStock.stockWithoutSales)}</p>
                          </div>

                          <div className="flex flex-row justify-between">
                            <p className="font-semibold">Total Penjualan</p>
                            <p>{formatNumber(totalSales * -1)}</p>
                          </div>
                        </div>

                        <Divider />

                        <div className="flex flex-row justify-between">
                          <p className="font-semibold">Stok Akhir</p>
                          <p>{formatNumber(getStock.latestStock)}</p>
                        </div>
                      </div>
                    }
                  >
                    <p className="text-lg font-semibold">
                      {formatNumber(getStock.latestStock)}
                    </p>
                  </Tooltip>
                  <p className="text-small">
                    dari {formatNumber(product.minimumStock)} {" stok minimum"}
                  </p>
                </CardBody>
              </Card>
            </div>

            <NewProductStockHistoryModal product={product} />
          </div>

          <ProductDetailTabs product={product} />
        </div>
      </section>
    </>
  );
}

import { getProducts } from "@/actions/products.action";
import { ForecastingListSection } from "@/components/ForecastingListSection";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";

export default async function ForecastingPage() {
  const { products } = await getProducts();

  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            href: "/forecastings",
            label: "Ramalan Penjualan",
          },
        ]}
      />

      <ForecastingListSection products={products} />
    </>
  );
}

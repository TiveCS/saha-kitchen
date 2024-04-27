import { getProducts } from "@/actions/products.action";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { ScrollShadow } from "@nextui-org/react";

export default async function AnalyticsPage() {
  const { products } = await getProducts();

  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Dashboard Analisis",
            href: "/analytics",
          },
        ]}
      />

      <ScrollShadow className="w-full h-[90vh] py-4 px-8">
        <AnalyticsSection products={products} />
      </ScrollShadow>
    </>
  );
}

import { getProducts } from "@/actions/products.action";
import { SalesListSection } from "@/components/SalesListSection";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";

export default async function SalesPage() {
  const getProductsResult = await getProducts();

  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Data Penjualan",
            href: "/sales",
          },
        ]}
      />

      <SalesListSection products={getProductsResult.products} />
    </>
  );
}

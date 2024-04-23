import { DashboardLinkSetter } from "@/store/dashboard-links.store";

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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
    </>
  );
}

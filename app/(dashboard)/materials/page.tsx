import { DashboardLinkSetter } from "@/store/dashboard-links.store";

export default async function MaterialsPage() {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            href: "/products",
            label: "Products",
          },
          {
            href: "/materials",
            label: "Materials",
          },
        ]}
      />

      <p>Material page</p>
    </>
  );
}

import { UsersTable } from "@/components/UsersTable";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button, Link } from "@nextui-org/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export default async function UsersManagementPage() {
  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Manajemen User",
            href: "/users",
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <header className="flex flex-row-reverse">
          <Button
            as={Link}
            href="/users/add"
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
          >
            Tambah User
          </Button>
        </header>

        <UsersTable />
      </section>
    </>
  );
}

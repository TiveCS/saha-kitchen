import { NewUserForm } from "@/components/NewUserForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";

export default async function AddUsersManagementPage() {
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
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href="/users"
        >
          Kembali
        </Button>

        <NewUserForm />
      </section>
    </>
  );
}

import { getUserById } from "@/actions/users.action";
import { EditUserForm } from "@/components/EditUserForm";
import { DashboardLinkSetter } from "@/store/dashboard-links.store";
import { Button, Link } from "@nextui-org/react";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { notFound, redirect } from "next/navigation";

export default async function EditUsersPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return redirect("/users");
  }

  const user = await getUserById(id);

  if (!user) return notFound();

  return (
    <>
      <DashboardLinkSetter
        links={[
          {
            label: "Manajemen User",
            href: "/users",
          },
          {
            label: "Ubah User",
            href: `/users/${params.id}/edit`,
          },
        ]}
      />

      <section className="flex-1 w-full px-8 py-4 space-y-12">
        <Button
          as={Link}
          startContent={<CaretLeft className="w-4 h-4" />}
          variant="ghost"
          href={`/users`}
        >
          Kembali
        </Button>

        <EditUserForm user={user} />
      </section>
    </>
  );
}

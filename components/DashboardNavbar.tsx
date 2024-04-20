import { AvatarMenu } from "./ui/AvatarMenu";
import { redirect } from "next/navigation";
import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";
import { auth, signOut } from "@/lib/auth";

export async function DashboardNavbar() {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const handleSignOut = async () => {
    "use server";

    await signOut({ redirectTo: "/login" });
  };

  return (
    <nav className="px-8 py-4 w-full flex flex-row justify-between items-center bg-gray-100 dark:bg-background">
      <div>
        <DashboardBreadcrumbs />
      </div>

      <div>
        <AvatarMenu user={session.user} handleSignOut={handleSignOut} />
      </div>
    </nav>
  );
}

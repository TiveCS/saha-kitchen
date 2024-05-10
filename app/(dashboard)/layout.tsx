import { DashboardNavbar } from "@/components/DashboardNavbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Suspense } from "react";
import Loading from "./loading";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-row">
      <DashboardSidebar />

      <div className="flex-1 w-full flex flex-col">
        <DashboardNavbar />

        <section className="flex-1 flex flex-col bg-orange-50 dark:bg-background">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </section>
      </div>
    </div>
  );
}

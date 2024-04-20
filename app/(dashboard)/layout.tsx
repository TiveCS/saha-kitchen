import { DashboardNavbar } from "@/components/DashboardNavbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-row">
      <DashboardSidebar />

      <div className="flex-1 w-full flex flex-col">
        <DashboardNavbar />

        <section className="flex-1 flex flex-col bg-gray-100 dark:bg-background">
          {children}
        </section>
      </div>
    </div>
  );
}

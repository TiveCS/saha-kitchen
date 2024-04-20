"use client";

import { useDashboardLinks } from "@/store/dashboard-links.store";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

export function DashboardBreadcrumbs() {
  const links = useDashboardLinks((state) => state.links);

  return (
    <Breadcrumbs>
      {links.map((link, index) => (
        <BreadcrumbItem key={link.label + index} href={link.href}>
          {link.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

"use client";

import { Listbox, ListboxItem, cn } from "@nextui-org/react";
import {
  House,
  Lego,
  ListMagnifyingGlass,
  Package,
  Receipt,
  UsersThree,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

export function DashboardSidebar() {
  const session = useSession();

  return (
    <motion.div
      className="border-r border-r-divider sticky grid grid-rows-9 max-h-screen"
      initial={{
        width: "14rem",
      }}
    >
      <header className="flex items-center justify-center font-medium">
        <Link href="/analytics">Saha Kitchen</Link>
      </header>

      <Listbox
        classNames={{ base: "row-span-7 px-4 py-6", list: "gap-y-4" }}
        itemClasses={{ base: "gap-x-2.5" }}
        aria-label="Navigasi menu utama"
      >
        <ListboxItem
          key={"dashboard"}
          startContent={<House className="w-5 h-5" />}
          href="/analytics"
        >
          Dashboard
        </ListboxItem>

        <ListboxItem
          key={"users"}
          startContent={<UsersThree className="w-5 h-5" />}
          href="/users"
          className={cn(session.data?.user.role !== UserRole.ADMIN && "hidden")}
        >
          Manajemen User
        </ListboxItem>

        <ListboxItem
          key={"products"}
          startContent={<Package className="w-5 h-5" />}
          href="/products"
        >
          Data Produk
        </ListboxItem>
        <ListboxItem
          key={"materials"}
          startContent={<Lego className="w-5 h-5" />}
          href="/materials"
        >
          Data Bahan Baku
        </ListboxItem>

        <ListboxItem
          key={"sales"}
          startContent={<Receipt className="w-5 h-5" />}
          href="/sales"
          className={cn(session.data?.user.role !== UserRole.ADMIN && "hidden")}
        >
          Data Penjualan
        </ListboxItem>

        <ListboxItem
          key={"forecastings"}
          startContent={<ListMagnifyingGlass className="w-5 h-5" />}
          href="/forecastings"
          className={cn(session.data?.user.role !== UserRole.ADMIN && "hidden")}
        >
          Forecasting
        </ListboxItem>
      </Listbox>

      <footer className="flex items-center justify-center">
        <ThemeSwitcher />
      </footer>
    </motion.div>
  );
}

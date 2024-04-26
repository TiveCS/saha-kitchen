"use client";

import { StructUser } from "@/lib/next-auth";
import { toPascalCase } from "@/utils/string";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User as NextUser,
} from "@nextui-org/react";
import { SignOut, User as UserIcon } from "@phosphor-icons/react";

interface AvatarMenuProps {
  user: StructUser;
  handleSignOut: () => Promise<void>;
}

export function AvatarMenu({ user, handleSignOut }: AvatarMenuProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <NextUser
          as="button"
          name={user.name}
          className="transition-transform"
          classNames={{
            base: "flex flex-row-reverse gap-x-4",
            wrapper: "inline-flex flex-col items-end",
          }}
          avatarProps={{
            showFallback: true,
            fallback: <UserIcon className="w-5 h-5" />,
          }}
          description={toPascalCase(user.role)}
        />
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Link Actions"
        onAction={async (key) => {
          if (key === "sign-out") await handleSignOut();
        }}
      >
        <DropdownItem
          key={"sign-out"}
          startContent={<SignOut className="h-4 w-4" />}
          color="danger"
          className="text-danger"
        >
          Keluar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

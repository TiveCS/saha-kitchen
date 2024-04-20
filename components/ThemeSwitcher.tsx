// app/components/ThemeSwitcher.tsx
"use client";

import { Button } from "@nextui-org/react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="flat"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      isIconOnly
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

"use client";

import { useEffect } from "react";
import { create } from "zustand";

type DashboardLink = {
  label: string;
  href: string;
};

interface DashboardLinksState {
  links: DashboardLink[];
  push: (link: DashboardLink) => void;
  pop: () => void;
  set: (links: DashboardLink[]) => void;
}

interface DashboardLinkSetterProps {
  links: DashboardLink[];
}

export const useDashboardLinks = create<DashboardLinksState>((set) => ({
  links: [],
  push: (link) => set((state) => ({ links: [...state.links, link] })),
  pop: () => set((state) => ({ links: state.links.slice(0, -1) })),
  set: (links) => set({ links }),
}));

export const DashboardLinkSetter = ({ links }: DashboardLinkSetterProps) => {
  const setLinks = useDashboardLinks((state) => state.set);

  useEffect(() => {
    setLinks(links);
  }, [links, setLinks]);

  return null;
};

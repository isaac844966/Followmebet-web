"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import TabsNavigation from "@/components/TabsNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const backgroundColor = isDarkMode ? "#0B0B3F" : "#fff";

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor }}>
      <main className="flex-1 pb-20">{children}</main>
      <TabsNavigation currentPath={pathname} />
    </div>
  );
}

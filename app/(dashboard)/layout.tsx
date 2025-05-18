import ProtectedRoute from "@/components/ProtectedRoutes";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute type="dashboard">
      <main>{children}</main>
    </ProtectedRoute>
  );
}

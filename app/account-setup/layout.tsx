import ProtectedRoute from "@/components/ProtectedRoutes";
import type React from "react";

export default function AccountSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

"use client";

import ProtectedRoute from "@/components/ProtectedRoutes";


export default function AccountSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute type="auth">
      <div >
        {children}
      </div>
    </ProtectedRoute>
  );
}

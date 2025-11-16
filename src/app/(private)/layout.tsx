// src/app/(private)/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#c5d0e4] flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">{children}</main>
    </div>
  );
}

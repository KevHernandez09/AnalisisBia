import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#dde9f5] via-[#c7d9ea] to-[#b1cbe2]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

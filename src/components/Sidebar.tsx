"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  PlusCircle,
  Workflow,
  LifeBuoy,
  BookOpen,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    {
      href: "/analisis-bia",
      label: "Mostrar Análisis BIA",
      icon: <FileText size={18} />,
    },
    {
      href: "/estrategias-bia",
      label: "Mostrar Estrategias de Continuidad",
      icon: <Workflow size={18} />,
    },
    {
      href: "/lista",
      label: "Mostrar Plan de Acción",
      icon: <PlusCircle size={18} />,
    },
    {
      href: "/proceso-critico",
      label: "Insertar Proceso Crítico",
      icon: <ClipboardCheck size={18} />,
    },
    {
      href: "/continuidad",
      label: "Insertar Estrategias de Continuidad",
      icon: <PlusCircle size={18} />,
    },
    {
      href: "/plan",
      label: "Insertar Plan de Acción",
      icon: <PlusCircle size={18} />,
    },
  ];

  // 🔹 LOGOUT: borra la cookie y redirige
  function handleLogout() {
    document.cookie = "bia_demo_auth=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0073a4] text-gray-200 border-r border-gray-800 flex flex-col select-none">
      
      {/* LOGO + HEADER */}
      <div className="px-6 py-6 border-b border-white/20 flex flex-col items-center gap-3">
        <div className="w-16 h-16 relative">
          <Image
            src="/logo-institucion.png"
            alt="Logo Institucional"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-sm font-semibold uppercase tracking-wide text-white/80">
          Menú - BIA
        </h1>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col py-4 gap-1 flex-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-6 py-2 text-sm rounded-r-full
                hover:bg-[#1a2530] transition-colors
                ${
                  active
                    ? "bg-[#1f2e3a] text-white font-medium"
                    : "text-white/80"
                }
              `}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto border-t border-gray-800 px-6 py-4 flex flex-col gap-3 text-sm">
        <Link
          href="/soporte"
          className="flex items-center gap-3 text-gray-300 hover:text-white transition"
        >
          <LifeBuoy size={18} />
          <span>Soporte Técnico</span>
        </Link>

        <Link
          href="/guia-usuario"
          className="flex items-center gap-3 text-gray-300 hover:text-white transition"
        >
          <BookOpen size={18} />
          <span>Guía del Usuario</span>
        </Link>

        {/* Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-300 hover:text-white transition mt-4 px-0 text-left"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

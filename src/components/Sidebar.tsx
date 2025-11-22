"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Workflow,
  ListTodo,
  ClipboardCheck,
  CirclePlus,
  ClipboardPlus,
  LifeBuoy,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const links: NavLink[] = [
    {
      href: "/analisis-bia",
      label: "Visualizar Análisis BIA",
      icon: <FileText size={18} />,
    },
    {
      href: "/estrategias-bia",
      label: "Mostrar Estrategias de Continuidad",
      icon: <Workflow size={18} />,
    },
    {
      href: "/lista",
      label: "Visualizar Plan de Acción",
      icon: <ListTodo size={18} />,
    },
    {
      href: "/proceso-critico",
      label: "Insertar Proceso Crítico",
      icon: <ClipboardCheck size={18} />,
    },
    {
      href: "/continuidad",
      label: "Añadir Estrategias de Continuidad",
      icon: <CirclePlus size={18} />,
    },
    {
      href: "/plan",
      label: "Agregar Plan de Acción",
      icon: <ClipboardPlus size={18} />,
    },
  ];

  // 🔹 LOGOUT: limpia la sesión en el servidor y redirige
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      router.push("/login");
    }
  }

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-64"}
        min-h-screen bg-[#0073a4] text-gray-200 border-r border-gray-800
        flex flex-col select-none
        transition-all duration-300 ease-in-out
      `}
    >
      {/* LOGO + HEADER */}
      <div
        className={`
          px-4 py-6 border-b border-white/20
          flex items-center ${collapsed ? "justify-center" : "justify-between"}
          gap-3
        `}
      >
        <div className={`relative ${collapsed ? "w-10 h-10" : "w-16 h-16"}`}>
          <Image
            src="/logo-institucion.png"
            alt="Logo Institucional"
            fill
            className="object-contain"
            priority
          />
        </div>

        {!collapsed && (
          <h1 className="text-sm font-semibold uppercase tracking-wide text-white/80">
            Menú - GRMJ
          </h1>
        )}

        {/* Botón colapsar/expandir */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className={`
            inline-flex items-center justify-center
            rounded-full border border-white/20 bg-white/10
            hover:bg-white/20 transition
            ${collapsed ? "w-8 h-8" : "w-8 h-8 ml-2"}
          `}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col py-4 gap-1 flex-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`
                flex items-center gap-3 px-4 py-2 text-sm rounded-r-full
                hover:bg-[#1a2530] transition-colors
                ${collapsed ? "justify-center" : ""}
                ${
                  active
                    ? "bg-[#1f2e3a] text-white font-medium"
                    : "text-white/80"
                }
              `}
            >
              {icon}
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto border-t border-gray-800 px-4 py-4 flex flex-col gap-3 text-sm">
        <Link
          href="/soporte"
          title="Soporte Técnico"
          className={`
            flex items-center gap-3 text-gray-300 hover:text-white transition
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LifeBuoy size={18} />
          {!collapsed && <span>Soporte Técnico</span>}
        </Link>

        <Link
          href="/guia-usuario"
          title="Guía del Usuario"
          className={`
            flex items-center gap-3 text-gray-300 hover:text-white transition
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <BookOpen size={18} />
          {!collapsed && <span>Guía del Usuario</span>}
        </Link>

        {/* Cerrar Sesión */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className={`
            flex items-center gap-3 text-gray-300 hover:text-white transition mt-4 px-0 text-left
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

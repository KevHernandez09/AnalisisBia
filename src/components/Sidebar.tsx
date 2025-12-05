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
  Home,
} from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

type NavSection = {
  title: string;
  items: NavLink[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const sections: NavSection[] = [
    {
      title: "General",
      items: [
        {
          href: "/inicio",
          label: "Inicio",
          icon: <Home size={18} />,
        },
      ],
    },
    {
      title: "Visualización y edición",
      items: [
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
      ],
    },
    {
      title: "Registro",
      items: [
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
      ],
    },
  ];

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      router.replace("/login");
    }
  }

  async function confirmLogout() {
    setShowLogoutModal(false);
    await handleLogout();
  }

  return (
    <>
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } min-h-screen bg-gradient-to-b from-[#004a73] via-[#003a5f] to-[#001f33]
        text-slate-100 border-r border-slate-900/70 flex flex-col select-none
        shadow-xl shadow-black/40 transition-all duration-300`}
      >
        {/* LOGO / HEADER */}
        <div
          className={`px-4 py-5 border-b border-white/10 flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`${collapsed ? "w-9 h-9" : "w-12 h-12"} relative`}>
              <Image
                src="/logo-institucion.png"
                alt="Logo Institucional"
                fill
                className="object-contain"
              />
            </div>

            {!collapsed && (
              <div className="leading-tight">
                <p className="text-[11px] uppercase tracking-widest text-white/60">
                  Sistema GRMJ
                </p>
                <h1 className="text-sm font-semibold text-white/90">
                  Menú principal
                </h1>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((p) => !p)}
            className="w-8 h-8 grid place-content-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* NAV PRINCIPAL (SIN SCROLL INTERNO) */}
        <nav className="flex-1 py-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-5">
              {!collapsed && (
                <p className="px-4 mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/60">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map(({ href, label, icon }) => {
                  const active = pathname === href;

                  return (
                    <div key={href} className="relative group">
                      <Link
                        href={href}
                        title={collapsed ? label : ""}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-r-full ${
                          collapsed ? "justify-center rounded-full mx-2" : ""
                        } ${
                          active
                            ? "bg-white/15 text-white font-medium shadow-inner"
                            : "text-white/80 hover:bg-white/10"
                        }`}
                      >
                        {icon}
                        {!collapsed && (
                          <span className="truncate">{label}</span>
                        )}
                      </Link>

                      {/* Tooltip en modo colapsado */}
                      {collapsed && (
                        <span
                          className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md bg-black/80 text-xs text-white px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity"
                        >
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER ABAJO (SE MUEVE CON EL SCROLL DE LA PÁGINA) */}
        <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-3 text-sm">
          <Link
            href="/soporte"
            className={`flex items-center gap-3 text-white/80 hover:text-white transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LifeBuoy size={18} />
            {!collapsed && <span>Soporte Técnico</span>}
          </Link>

          <Link
            href="/guia-usuario"
            className={`flex items-center gap-3 text-white/80 hover:text-white transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <BookOpen size={18} />
            {!collapsed && <span>Guía del Usuario</span>}
          </Link>

          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center gap-3 text-red-200 hover:text-red-400 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* MODAL CERRAR SESIÓN */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* Caja de diálogo */}
          <div className="relative z-50 w-full max-w-sm mx-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/60 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-red-500/15 flex items-center justify-center text-red-400">
                <LogOut size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-50">
                  ¿Cerrar sesión?
                </h2>
                <p className="text-xs text-slate-400">
                  Se cerrará su sesión actual en el sistema GRMJ.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Si continúa, deberá volver a ingresar sus credenciales para
              acceder nuevamente a la plataforma.
            </p>

            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-600/70 text-slate-200 hover:bg-slate-800/80 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium hover:from-red-400 hover:to-rose-400 shadow-md shadow-red-900/40 transition flex items-center gap-1.5"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

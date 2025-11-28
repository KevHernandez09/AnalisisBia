"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Workflow,
  FileText,
  ShieldCheck,
  UserCheck,
  LayoutGrid,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ProcesoPrioridad = {
  prioridad: "Alta" | "Media" | "Baja" | string;
  count: number;
};

type EstrategiaTipo = {
  tipo: string;
  count: number;
};

type StatsResponse = {
  totalAreas: number;
  totalSubAreas: number;
  totalProcesos: number;
  totalEstrategias: number;
  totalPlanes: number;
  procesosPorPrioridad: ProcesoPrioridad[];
  estrategiasPorTipo: EstrategiaTipo[];
};

type MeUser = {
  id: string;
  name: string | null;
  email: string;
};

const PRIORIDAD_LABELS: Record<string, string> = {
  Alta: "Alta",
  Media: "Media",
  Baja: "Baja",
};

const PRIORITY_COLORS: Record<string, string> = {
  Alta: "#ef4444", // rojo
  Media: "#eab308", // amarillo
  Baja: "#22c55e", // verde
};

const PRIORITY_ORDER: ("Alta" | "Media" | "Baja")[] = ["Alta", "Media", "Baja"];

// Paleta para barras de estrategias por tipo
const STRATEGY_COLORS = [
  "#38bdf8", // cyan
  "#22c55e", // verde
  "#eab308", // amarillo
  "#f97316", // naranja
  "#6366f1", // violeta
  "#ec4899", // rosado
];

function PriorityLegend({
  items,
}: {
  items: { prioridad: string; color: string }[];
}) {
  return (
    <div className="flex items-center justify-center gap-8 mt-4 flex-wrap">
      {items.map((item) => (
        <div
          key={item.prioridad}
          className="flex items-center gap-2 text-sm text-slate-100"
        >
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span>{PRIORIDAD_LABELS[item.prioridad] ?? item.prioridad}</span>
        </div>
      ))}
    </div>
  );
}

export default function InicioPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<MeUser | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats", { credentials: "include" });
        const data = (await res.json()) as StatsResponse;
        setStats(data);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user as MeUser);
        }
      } catch (err) {
        console.error("Error cargando usuario actual:", err);
      }
    }
    fetchMe();
  }, []);

  const displayUserName =
    currentUser?.name?.trim() ||
    currentUser?.email ||
    "Usuario autenticado";

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 md:w-24 md:h-24 drop-shadow-xl">
              <Image
                src="/logo-institucion.png"
                alt="Logo Institucional"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Panel principal del Sistema GRMJ
              </h1>
              <p className="text-slate-300 text-sm md:text-base mt-1">
                Resumen institucional del BIA y continuidad operativa.
              </p>
            </div>
          </div>

          {/* Badge de usuario con nombre/correo */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <UserCheck size={18} />
            <span>{displayUserName}</span>
          </div>
        </header>

        {loading && (
          <p className="text-slate-300 text-sm">Cargando estadísticas…</p>
        )}

        {stats && (
          <>
            {/* TARJETAS RESUMEN */}
            <section className="grid md:grid-cols-5 gap-4">
              <StatCard
                icon={<LayoutGrid size={22} />}
                label="Departamentos"
                value={stats.totalAreas}
              />
              <StatCard
                icon={<Workflow size={22} />}
                label="Subáreas"
                value={stats.totalSubAreas}
              />
              <StatCard
                icon={<FileText size={22} />}
                label="Procesos críticos"
                value={stats.totalProcesos}
              />
              <StatCard
                icon={<ShieldCheck size={22} />}
                label="Estrategias"
                value={stats.totalEstrategias}
              />
              <StatCard
                icon={<ShieldCheck size={22} />}
                label="Planes"
                value={stats.totalPlanes}
              />
            </section>

            {/* PROCESOS POR PRIORIDAD */}
            <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col mt-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ShieldCheck size={18} /> Procesos críticos por prioridad
              </h2>
              <p className="text-xs text-slate-300 mb-4">
                Distribución total según prioridad institucional (Alta, Media,
                Baja).
              </p>

              {(() => {
                const raw = stats.procesosPorPrioridad || [];
                const priorityData: ProcesoPrioridad[] = PRIORITY_ORDER.map(
                  (p) => {
                    const found = raw.find((r) => r.prioridad === p);
                    return {
                      prioridad: p,
                      count: found ? found.count : 0,
                    };
                  }
                );

                const total = priorityData.reduce(
                  (acc, cur) => acc + cur.count,
                  0
                );

                if (total === 0) {
                  return (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-300 text-sm">
                      <p>No hay procesos críticos registrados aún.</p>
                    </div>
                  );
                }

                return (
                  <>
                    <div className="w-full h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={priorityData}
                            dataKey="count"
                            nameKey="prioridad"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                          >
                            {priorityData.map((entry) => (
                              <Cell
                                key={entry.prioridad}
                                fill={
                                  PRIORITY_COLORS[entry.prioridad] ??
                                  "#6b7280"
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any, _name: any, props: any) => [
                              `${value} procesos`,
                              PRIORIDAD_LABELS[props.payload.prioridad] ??
                                props.payload.prioridad,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <PriorityLegend
                      items={priorityData.map((p) => ({
                        prioridad: p.prioridad,
                        color:
                          PRIORITY_COLORS[p.prioridad] ?? "#6b7280",
                      }))}
                    />
                  </>
                );
              })()}
            </section>

            {/* ESTRATEGIAS POR TIPO */}
            <section className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-6 flex flex-col mt-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Workflow size={18} /> Estrategias por tipo
              </h2>
              <p className="text-xs text-slate-300 mb-4">
                Cantidad de estrategias registradas según su tipo principal.
              </p>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.estrategiasPorTipo}>
                    <XAxis dataKey="tipo" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, _name: any, props: any) => [
                        `${value} estrategias`,
                        props.payload.tipo,
                      ]}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {stats.estrategiasPorTipo.map((entry, index) => (
                        <Cell
                          key={`bar-${entry.tipo}-${index}`}
                          fill={
                            STRATEGY_COLORS[index % STRATEGY_COLORS.length]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-slate-300">
          {label}
        </span>
        <div className="text-cyan-400">{icon}</div>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  CartesianGrid,
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
  Alta: "#ef4444",
  Media: "#eab308",
  Baja: "#22c55e",
};

const PRIORITY_ORDER: ("Alta" | "Media" | "Baja")[] = ["Alta", "Media", "Baja"];

const STRATEGY_COLORS = [
  "#38bdf8",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#6366f1",
  "#ec4899",
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PriorityLegend({
  items,
}: {
  items: { prioridad: string; color: string; count: number }[];
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      {items.map((item) => (
        <div
          key={item.prioridad}
          className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium">
            {PRIORIDAD_LABELS[item.prioridad] ?? item.prioridad}
          </span>
          <span className="text-slate-500">•</span>
          <span className="tabular-nums text-slate-600">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/0 to-sky-100/40" />
      <div className="relative">{children}</div>
    </section>
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
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-4 shadow-sm backdrop-blur transition will-change-transform hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold leading-none text-slate-900 tabular-nums">
            {value}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-2 text-sky-700 shadow-sm transition group-hover:scale-[1.02]">
          {icon}
        </div>
      </div>

      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur">
      <div className="h-2 w-24 rounded bg-slate-200/80" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-200/80" />
      <div className="mt-5 h-2 w-full rounded bg-slate-200/60" />
      <div className="mt-3 h-2 w-2/3 rounded bg-slate-200/60" />
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  kind,
}: {
  active?: boolean;
  payload?: readonly any[];
  label?: string | number;
  kind: "bar" | "pie";
}) {
  if (!active || !payload?.length) return null;

  const p = payload[0] as any;

  const name =
    kind === "bar"
      ? p?.payload?.tipo ?? label
      : PRIORIDAD_LABELS[p?.payload?.prioridad] ?? p?.payload?.prioridad;

  const value = p?.value ?? p?.payload?.count ?? 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur">
      <p className="font-semibold text-slate-900">{String(name ?? "")}</p>
      <p className="mt-1">
        <span className="text-slate-500">Cantidad: </span>
        <span className="font-medium tabular-nums">{value}</span>
      </p>
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
        if (data.user) setCurrentUser(data.user as MeUser);
      } catch (err) {
        console.error("Error cargando usuario actual:", err);
      }
    }
    fetchMe();
  }, []);

  const displayUserName =
    currentUser?.name?.trim() || currentUser?.email || "Usuario autenticado";

  const priorityData = useMemo(() => {
    const raw = stats?.procesosPorPrioridad ?? [];
    return PRIORITY_ORDER.map((p) => {
      const found = raw.find((r) => r.prioridad === p);
      return { prioridad: p, count: found ? found.count : 0 };
    });
  }, [stats?.procesosPorPrioridad]);

  const totalPriority = useMemo(() => {
    return priorityData.reduce((acc, cur) => acc + cur.count, 0);
  }, [priorityData]);

  return (
    <main className="relative min-h-screen text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-2 pt-6 pb-10 space-y-8">
        {/*HEADER */}
        <GlassCard className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 md:h-20 md:w-20">
                <div className="absolute inset-0 rounded-2xl bg-white/70 shadow-sm" />
                <Image
                  src="/logo-institucion.png"
                  alt="Logo Institucional"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                 GRMJ
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Resumen institucional del BIA y continuidad operativa.
                </p>

                <div className="absolute right-6 top-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur">
                    <UserCheck size={14} />
                    <span className="font-medium">{displayUserName}</span>
                  </span>
                </div>

              </div>
            </div>

          </div>
        </GlassCard>

        {/* LOADING */}
        {loading && (
          <section className="grid gap-4 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>
        )}

        {/* CONTENT */}
        {stats && (
          <>
            <section className="grid gap-4 md:grid-cols-5">
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

            {/* CHARTS GRID */}
            <section className="grid gap-6 lg:grid-cols-2">
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      <ShieldCheck size={18} />
                      Procesos críticos por prioridad
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Distribución total según prioridad institucional.
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 text-xs text-slate-600 backdrop-blur">
                    Total:{" "}
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {totalPriority}
                    </span>
                  </span>
                </div>

                <div className="mt-4">
                  {totalPriority === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 text-sm text-slate-600">
                      <p className="font-medium text-slate-900">
                        No hay procesos críticos registrados aún.
                      </p>

                    </div>
                  ) : (
                    <>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={priorityData}
                              dataKey="count"
                              nameKey="prioridad"
                              cx="50%"
                              cy="50%"
                              innerRadius={62}
                              outerRadius={92}
                              paddingAngle={5}
                              stroke="rgba(255,255,255,0.9)"
                              strokeWidth={2}
                            >
                              {priorityData.map((entry) => (
                                <Cell
                                  key={entry.prioridad}
                                  fill={PRIORITY_COLORS[entry.prioridad] ?? "#6b7280"}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              content={(props) => (
                                <ChartTooltip {...props} kind="pie" />
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <PriorityLegend
                        items={priorityData.map((p) => ({
                          prioridad: p.prioridad,
                          color: PRIORITY_COLORS[p.prioridad] ?? "#6b7280",
                          count: p.count,
                        }))}
                      />
                    </>
                  )}
                </div>
              </GlassCard>

              {/* BAR */}
              <GlassCard className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                      <Workflow size={18} />
                      Estrategias por tipo
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Cantidad de estrategias registradas según su tipo principal.
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.estrategiasPorTipo}
                      margin={{ top: 8, right: 10, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="4 6" opacity={0.35} />
                      <XAxis
                        dataKey="tipo"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <XAxis
                        dataKey="tipo"
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                        height={0}
                      />

                      <Tooltip
                        content={(props) => <ChartTooltip {...props} kind="bar" />}
                      />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]} maxBarSize={46}>
                        {stats.estrategiasPorTipo.map((entry, index) => (
                          <Cell
                            key={`bar-${entry.tipo}-${index}`}
                            fill={STRATEGY_COLORS[index % STRATEGY_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {stats.estrategiasPorTipo.slice(0, 6).map((e, i) => (
                    <span
                      key={`${e.tipo}-${i}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 text-xs text-slate-700 backdrop-blur"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: STRATEGY_COLORS[i % STRATEGY_COLORS.length],
                        }}
                      />
                      <span className="font-medium">{e.tipo}</span>
                      <span className="text-slate-500">•</span>
                      <span className="tabular-nums text-slate-600">{e.count}</span>
                    </span>
                  ))}
                </div>
              </GlassCard>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

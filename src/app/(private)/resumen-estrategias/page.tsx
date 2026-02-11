"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
    ShieldCheck,
    Siren,
    RotateCcw,
    Megaphone,
    ChevronRight,
    Check,
} from "lucide-react";

type StrategyBlock = {
    heading: string;
    items: string[];
};

type StrategySection = {
    id: "prevencion" | "contingencia" | "recuperacion" | "comunicacion";
    title: string;
    description: string;
    blocks: StrategyBlock[];
};

function classNames(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const sectionMeta: Record<
    StrategySection["id"],
    { short: string; icon: ReactNode; accent: string; soft: string }
> = {
    prevencion: {
        short: "Prevención",
        icon: <ShieldCheck size={16} />,
        accent: "from-emerald-500 to-sky-500",
        soft: "bg-emerald-500/10 text-emerald-700 ring-emerald-200/70",
    },
    contingencia: {
        short: "Contingencia",
        icon: <Siren size={16} />,
        accent: "from-amber-500 to-orange-500",
        soft: "bg-amber-500/10 text-amber-700 ring-amber-200/70",
    },
    recuperacion: {
        short: "Recuperación",
        icon: <RotateCcw size={16} />,
        accent: "from-indigo-500 to-fuchsia-500",
        soft: "bg-indigo-500/10 text-indigo-700 ring-indigo-200/70",
    },
    comunicacion: {
        short: "Comunicación",
        icon: <Megaphone size={16} />,
        accent: "from-sky-500 to-violet-500",
        soft: "bg-sky-500/10 text-sky-700 ring-sky-200/70",
    },
};

function TabButton({
    active,
    id,
    onClick,
}: {
    active: boolean;
    id: StrategySection["id"];
    onClick: () => void;
}) {
    const meta = sectionMeta[id];

    return (
        <button
            type="button"
            onClick={onClick}
            role="tab"
            aria-selected={active}
            className={classNames(
                "group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition",
                "focus:outline-none focus:ring-2 focus:ring-slate-300",
                active
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white"
            )}
        >
            {active ? (
                <span
                    className={classNames(
                        "pointer-events-none absolute inset-x-1 -bottom-2 h-1 rounded-full bg-gradient-to-r opacity-90",
                        sectionMeta[id].accent
                    )}
                    aria-hidden="true"
                />
            ) : null}

            <span
                className={classNames(
                    "grid place-content-center rounded-full border p-1 transition",
                    active
                        ? "border-white/25 bg-white/10"
                        : "border-slate-200 bg-slate-50 group-hover:bg-slate-100"
                )}
                aria-hidden="true"
            >
                {meta.icon}
            </span>

            <span className="truncate">{meta.short}</span>

            {!active ? (
                <ChevronRight
                    size={14}
                    className="opacity-0 -ml-1 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition"
                    aria-hidden="true"
                />
            ) : null}
        </button>
    );
}

function BlockCard({
    block,
    accent,
}: {
    block: StrategyBlock;
    accent: string;
}) {
    return (
        <article
            className={classNames(
                "group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 shadow-sm backdrop-blur",
                "transition hover:-translate-y-0.5 hover:shadow-md"
            )}
        >
            <div
                className={classNames(
                    "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-90",
                    accent
                )}
            />

            <header className="px-5 pt-5 pb-3">
                <h3 className="text-base font-semibold text-slate-900">
                    {block.heading}
                </h3>
            </header>

            <div className="px-5 pb-5">
                <ul className="space-y-2.5 text-sm text-slate-700">
                    {block.items.map((item, idx) => (
                        <li key={`${block.heading}-${idx}`} className="flex gap-2.5">
                            <span
                                className="mt-0.5 grid h-6 w-6 place-content-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 shrink-0"
                                aria-hidden="true"
                            >
                                <Check size={14} />
                            </span>
                            <span className="leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}

export default function ResumenEstrategiasPage() {
    const sections: StrategySection[] = useMemo(
        () => [
            {
                id: "prevencion",
                title: "Estrategias de Prevención",
                description:
                    "Buscan disminuir la probabilidad de interrupciones y fortalecer la resiliencia de la institución.",
                blocks: [
                    {
                        heading: "Fortalecimiento de redundancias tecnológicas",
                        items: [
                            "Implementar servidores espejo fuera de los edificios legislativos.",
                            "Asegurar respaldos automáticos, cifrados y distribuidos geográficamente.",
                            "Establecer rutas alternas de conectividad.",
                            "Fortalecer la protección contra ciberataques (ISO 27001).",
                            "Mantener inventario de hardware crítico siempre actualizado.",
                        ],
                    },
                    {
                        heading: "Mantenimiento continuo de infraestructura",
                        items: [
                            "Plan maestro de mantenimiento preventivo y correctivo.",
                            "Inventario de infraestructura crítica.",
                            "Revisión periódica de sistemas eléctricos, climatización, agua, accesos y ascensores.",
                            "Gestión ambiental preventiva (residuos, derrames, ventilación, iluminación).",
                        ],
                    },
                    {
                        heading: "Gestión preventiva de salud ocupacional y riesgos sanitarios",
                        items: [
                            "Revisión periódica de accesos y anillos de seguridad.",
                            "Protocolos permanentes de control de ingreso.",
                            "Verificación de rutas de evacuación accesibles y seguras.",
                            "Actualización de planes de emergencia institucionales.",
                        ],
                    },
                    {
                        heading: "Prevención basada en Seguridad Parlamentaria",
                        items: [
                            "Revisión periódica de los accesos y anillos de seguridad.",
                            "Actualización periódica de protocolos y procedimientos de seguridad.",
                            "Verificación y actualización de planes de emergencia.",
                        ],
                    },
                    {
                        heading: "Procesos de capacitación",
                        items: [
                            "Brindar capacitación en materia de continuidad institucional.",
                            "Dar a conocer los protocolos de conocimiento general hacia la Comunidad Legislativa.",
                        ],
                    },
                    {
                        heading: "Ejecución de pruebas y simulacros",
                        items: [
                            "Desarrollo de pruebas y simulacros en la frecuencia establecida en cada una de las estrategias de prevención departamentales para lograr resiliencia institucional ante un evento disruptivo.",
                        ],
                    },
                ],
            },
            {
                id: "contingencia",
                title: "Estrategias de Contingencia",
                description:
                    "Buscan mantener operaciones esenciales durante el evento disruptivo.",
                blocks: [
                    {
                        heading: "Activación del Comité de Mando",
                        items: [
                            "Ejecutar las acciones establecidas en el apartado de “Gobernanza – Nivel 2: Estratégico”. Cuya función principal se enmarca en dirigir, supervisar y garantizar la coordinación político-administrativa de la continuidad del servicio durante un evento disruptivo.",
                        ],
                    },
                    {
                        heading: "Continuidad tecnológica inmediata (RTO inmediato)",
                        items: [
                            "Uso de sistemas alternos y respaldos.",
                            "Creación de “modo de operación mínima” (mínimo vital) para SIL y SIAF.",
                            "Accesos remotos seguros para diputaciones y personas funcionarias esenciales.",
                            "Protocolos de operación parcial sin infraestructura física (teletrabajo).",
                        ],
                    },
                    {
                        heading:
                            "Reubicación táctica del personal crítico (afectación en la infraestructura Edificio A)",
                        items: [
                            "Uso de edificios alternos del Poder Legislativo.",
                            "Uso de salas equipadas para contingencias (espacios multiservicio).",
                            "Activación de teletrabajo estratégico si las condiciones lo permiten.",
                            "Asegurar respaldo de conectividad móvil.",
                        ],
                    },
                    {
                        heading: "Mantenimiento de servicios esenciales",
                        items: [
                            "Energía mínima para procesos legislativos.",
                            "Servicio de limpieza con prioridad sanitaria.",
                            "Disponibilidad de transporte institucional.",
                            "Aseguramiento de suministros críticos a través de Proveeduría.",
                        ],
                    },
                    {
                        heading: "Gestión de emergencias físicas (activación del CIE)",
                        items: [
                            "Evacuación ordenada, control de accesos, contención de daños y verificación de seguridad antes del reingreso.",
                        ],
                    },
                    {
                        heading: "Continuidad del proceso legislativo",
                        items: [
                            "Debe mantenerse incluso con condiciones mínimas, siguiendo modelos internacionales. Las medidas que deben aplicarse son:",
                            "Sesiones en modalidad alterna (virtual o mixta, según la normativa).",
                            "Uso de plataformas certificadas.",
                            "Registro digital de votaciones.",
                            "Protocolos para actas y orden del día en emergencias.",
                        ],
                    },
                ],
            },
            {
                id: "recuperacion",
                title: "Estrategias de Recuperación",
                description:
                    "Buscan restaurar la normalidad institucional después de un evento.",
                blocks: [
                    {
                        heading: "Recuperación tecnológica",
                        items: [
                            "Restauración de sistemas principales a partir de respaldos.",
                            "Validación de integridad de los datos.",
                            "Levantamiento de servicios (SIL, SIAF, correo, servidores).",
                            "Evaluación de daños y reporte de vulnerabilidades.",
                        ],
                    },
                    {
                        heading: "Recuperación operativa",
                        items: [
                            "Restablecimiento de servicios administrativos (RRHH, Financiero, Proveeduría).",
                            "Reapertura progresiva de instalaciones.",
                            "Reincorporación del personal en fases.",
                        ],
                    },
                    {
                        heading: "Recuperación financiera",
                        items: [
                            "Ajustes presupuestarios.",
                            "Reprogramación de pagos y contratos.",
                            "Solicitud de recursos extraordinarios (si corresponde).",
                        ],
                    },
                    {
                        heading: "Recuperación documental y jurídica",
                        items: [
                            "Reprocesamiento de Actas, Acuerdos y documentos críticos.",
                            "Resguardo de expedientes afectados.",
                            "Certificación legal posterior al evento.",
                        ],
                    },
                    {
                        heading: "Recuperación ambiental (de ser necesario)",
                        items: [
                            "Mitigación de daños ambientales.",
                            "Limpieza técnica.",
                            "Revisión de la calidad del aire, agua, residuos.",
                        ],
                    },
                    {
                        heading: "Evaluación post-evento",
                        items: [
                            "Informe técnico del CICO.",
                            "Informe jurídico de Asesoría Legal.",
                            "Informe de control interno.",
                            "Lecciones aprendidas.",
                            "Actualización del PCSAL.",
                        ],
                    },
                ],
            },
            {
                id: "comunicacion",
                title: "Estrategias de Comunicación/Divulgación",
                description:
                    "La comunicación fue una de las debilidades detectadas en los planes de continuidad departamentales. Estas estrategias son clave para gestionar temas atinentes a la reputación, orden y claridad durante emergencias.",
                blocks: [
                    {
                        heading: "Centralización institucional de la comunicación",
                        items: [
                            "El Departamento de Prensa Institucional y la Gerencia General de forma coordinada será la única vocería autorizada, bajo lineamientos del Directorio Legislativo y el CICO.",
                        ],
                    },
                    {
                        heading: "Protocolos de comunicación interna",
                        items: [
                            "Canales oficiales: correo institucional, mensajería corporativa y comunicados formales.",
                            "Información inmediata a responsables críticos.",
                            "Instrucciones claras, verificadas y accesibles.",
                        ],
                    },
                    {
                        heading: "Comunicación externa estratégica",
                        items: [
                            "Informes de estado institucional.",
                            "Respuesta mediática coordinada entre Prensa Institucional y la Gerencia General.",
                            "Control de comunicación informal y desinformación.",
                            "Mensajes que salvaguarden reputación y confianza.",
                        ],
                    },
                    {
                        heading: "Coordinación interinstitucional",
                        items: [
                            "Instituciones como:",
                            "CNE",
                            "Bomberos",
                            "CCSS",
                            "MICITT",
                            "Fuerza Pública",
                            "Proveedores críticos",
                        ],
                    },
                ],
            },
        ],
        []
    );

    // Guard clause anti-crash (SSR/CSR)
    if (sections.length === 0) {
        return (
            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <div className="rounded-3xl border border-slate-200/70 bg-white/75 p-6 shadow-sm backdrop-blur">
                    <h1 className="text-lg font-semibold text-slate-900">
                        No hay estrategias cargadas
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Verificá el arreglo <code className="font-mono">sections</code>.
                    </p>
                </div>
            </main>
        );
    }

    const [activeId, setActiveId] = useState<StrategySection["id"]>(sections[0].id);

    const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];
    const meta = sectionMeta[activeSection.id];

    return (
        <main className="relative mx-auto w-full max-w-6xl px-4 py-8">
            {/* background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl" />
                <div className="absolute top-28 -left-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
            </div>

            {/* header */}
            <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-6 shadow-sm backdrop-blur">
                <div
                    className={classNames(
                        "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
                        "from-white/50 via-white/0 to-sky-100/40"
                    )}
                />

                <div className="relative space-y-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Resumen por tipo de estrategias
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Continuidad institucional
                            </h1>
                            <p className="text-sm text-slate-600">
                                Navegá por categoría y revisá los bloques clave de cada plan.
                            </p>
                        </div>

                        <div
                            className={classNames(
                                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ring-1 bg-white/70 backdrop-blur shadow-sm",
                                meta.soft
                            )}
                        >
                            <span className="grid place-content-center rounded-full bg-slate-900 text-white p-1">
                                {meta.icon}
                            </span>
                            <span className="font-medium">{meta.short}</span>
                        </div>
                    </div>

                    <div role="tablist" aria-label="Categorías" className="flex flex-wrap gap-2 pt-2">
                        {sections.map((s) => (
                            <TabButton
                                key={s.id}
                                id={s.id}
                                active={s.id === activeId}
                                onClick={() => setActiveId(s.id)}
                            />
                        ))}
                    </div>
                </div>
            </header>

            {/* content */}
            <section role="tabpanel" aria-label={activeSection.title} className="relative mt-6 space-y-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-5 shadow-sm backdrop-blur">
                    <div className={classNames("mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r", meta.accent)} />
                    <h2 className="text-lg font-semibold text-slate-900">{activeSection.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{activeSection.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {activeSection.blocks.map((block) => (
                        <BlockCard key={block.heading} block={block} accent={meta.accent} />
                    ))}
                </div>
            </section>
        </main>
    );
}

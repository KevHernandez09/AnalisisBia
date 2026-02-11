"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ShieldCheck, Siren, RotateCcw, Megaphone, ChevronRight } from "lucide-react";

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
    { short: string; icon: ReactNode }
> = {
    prevencion: { short: "Prevención", icon: <ShieldCheck size={16} /> },
    contingencia: { short: "Contingencia", icon: <Siren size={16} /> },
    recuperacion: { short: "Recuperación", icon: <RotateCcw size={16} /> },
    comunicacion: { short: "Comunicación", icon: <Megaphone size={16} /> },
};

function TabButton({
    active,
    id,
    label,
    onClick,
}: {
    active: boolean;
    id: StrategySection["id"];
    label: string;
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
                "group inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
                "focus:outline-none focus:ring-2 focus:ring-slate-300",
                active
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
            )}
        >
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

function BlockCard({ block }: { block: StrategyBlock }) {
    return (
        <article
            className={classNames(
                "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
                "transition hover:-translate-y-0.5 hover:shadow-md"
            )}
        >
            <header className="px-5 pt-5 pb-3">
                <h3 className="text-base font-semibold text-slate-900">{block.heading}</h3>
            </header>

            <div className="px-5 pb-5">
                <ul className="space-y-2.5 text-sm text-slate-700">
                    {block.items.map((item) => (
                        <li key={item} className="flex gap-2.5">
                            <span
                                className="mt-1.5 h-5 w-5 rounded-full bg-slate-100 text-slate-600 grid place-content-center shrink-0"
                                aria-hidden="true"
                            >
                                •
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
                            "Brindar capacitación en materia de continuidad institucional.",
                            "Dar a conocer los protocolos de conocimiento general hacia la Comunidad Legislativa.",
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

    const [activeId, setActiveId] = useState<StrategySection["id"]>("prevencion");
    const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];
    const meta = sectionMeta[activeSection.id];

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-8">
            <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                        Resumen por tipo de estrategias
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Continuidad institucional
                            </h1>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
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
                                label={s.title}
                                onClick={() => setActiveId(s.id)}
                            />
                        ))}
                    </div>
                </div>
            </header>

            <section role="tabpanel" aria-label={activeSection.title} className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        {activeSection.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        {activeSection.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {activeSection.blocks.map((block) => (
                        <BlockCard key={block.heading} block={block} />
                    ))}
                </div>
            </section>
        </main>
    );
}

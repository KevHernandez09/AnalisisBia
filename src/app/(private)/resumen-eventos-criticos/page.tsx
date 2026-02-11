"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  CloudLightning,
  ShieldAlert,
  Skull,
  Cpu,
  Leaf,
  Landmark,
  ChevronRight,
} from "lucide-react";

type PlanSection = {
  heading: string;
  items: string[];
};

type Plan = {
  id:
    | "naturales"
    | "tecnologicos"
    | "sanitarios"
    | "seguridad-fisica"
    | "ambientales"
    | "politica";
  title: string;
  subtitle: string;
  objective: string;
  scenarios: string[];
  activation?: string[]; // para los planes que tienen “Activación inicial” en bullets/lines
  sections: PlanSection[];
  committees?: string[];
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const planMeta: Record<Plan["id"], { short: string; icon: ReactNode }> = {
  naturales: { short: "Naturales", icon: <CloudLightning size={16} /> },
  tecnologicos: { short: "Tecnológicos", icon: <Cpu size={16} /> },
  sanitarios: { short: "Sanitarios", icon: <Skull size={16} /> },
  "seguridad-fisica": { short: "Seguridad física", icon: <ShieldAlert size={16} /> },
  ambientales: { short: "Ambientales", icon: <Leaf size={16} /> },
  politica: { short: "Naturaleza política", icon: <Landmark size={16} /> },
};

function TabButton({
  active,
  id,
  label,
  onClick,
}: {
  active: boolean;
  id: Plan["id"];
  label: string;
  onClick: () => void;
}) {
  const meta = planMeta[id];

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

      <span className="truncate">{label}</span>

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

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="px-5 pt-5 pb-3 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-sm text-slate-700">
      {items.map((item) => (
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
  );
}

export default function ResumenEventosCriticosPage() {
  const plans: Plan[] = useMemo(
    () => [
      {
        id: "naturales",
        title: "PLAN DE RESPUESTA ANTE EVENTOS NATURALES",
        subtitle: "PLANES ESPECÍFICOS POR EVENTO DISRUPTIVO",
        objective:
          "Garantizar la continuidad de los procesos legislativos y administrativos ante sismos, inundaciones, tormentas eléctricas, deslizamientos u otros fenómenos naturales.",
        scenarios: [
          "Sismo que afecte la estructura del edificio.",
          "Inundación en zonas de sótanos y accesos.",
          "Tormentas eléctricas que dañen sistemas eléctricos o servidores.",
          "Escombros u obstáculos que afecten accesos al Congreso.",
        ],
        sections: [
          {
            heading: "Activación inicial",
            items: [
              "Seguridad Parlamentaria y/o CIE detecta daños y coordina evacuación.",
              "Servicios Generales evalúa la infraestructura.",
              "Servicios de Salud atiende a las personas afectadas.",
              "TI verifica los sistemas afectados.",
            ],
          },
          {
            heading: "Acciones inmediatas",
            items: [
              "Evacuación total según rutas del Plan Institucional de Emergencias.",
              "Corte preventivo de energía en zonas afectadas.",
              "Evaluación estructural rápida.",
              "Activación del CICO si hay daño significativo.",
              "Verificación de la integridad de los servidores y sistemas.",
            ],
          },
          {
            heading: "Acciones de las primeras 24 horas",
            items: [
              "Establecimiento de sede alterna (si corresponde).",
              "Restablecimiento parcial de los sistemas críticos.",
              "Priorización del proceso legislativo en salas seguras.",
              "Revisión de daños a oficinas esenciales.",
            ],
          },
          {
            heading: "Recuperación",
            items: [
              "Inspección profunda del edificio (perito estructural).",
              "Plan de reingreso progresivo.",
              "Restauración de la infraestructura y de los servicios.",
              "Reposición de equipos dañados.",
            ],
          },
        ],
        committees: [
          "CIE (emergencia física)",
          "CICO (continuidad operativa)",
          "Comité de Mando (si requiere reubicación del plenario)",
        ],
      },

      {
        id: "tecnologicos",
        title: "PLAN DE RESPUESTA ANTE EVENTOS TECNOLÓGICOS / CIBERATAQUES",
        subtitle: "PLANES ESPECÍFICOS POR EVENTO DISRUPTIVO",
        objective:
          "Proteger la integridad de la información institucional y garantizar la continuidad tecnológica en caso de caídas de sistemas, ransomware, ataques DDoS, pérdida de datos o fallas de infraestructura digital.",
        scenarios: [
          "Caída completa de servidores.",
          "Acceso no autorizado a bases de datos.",
          "Encriptación de información (ransomware).",
          "Fallo de red institucional.",
          "Interrupción de los sistemas críticos.",
        ],
        sections: [
          {
            heading: "Activación inicial",
            items: [
              "Tecnologías de Información detecta anomalía.",
              "Activación de protocolos de seguridad de la información.",
              "Informa a Gerencia General para activar PCSAL sin escala.",
            ],
          },
          {
            heading: "Acciones inmediatas",
            items: [
              "Aislamiento de la red afectada.",
              "Bloqueo de accesos sospechosos.",
              "Cierre temporal de los sistemas críticos para evitar corrupción de datos.",
              "Activación de respaldos.",
              "Comunicación institucional centralizada para evitar desinformación.",
            ],
          },
          {
            heading: "Acciones de las primeras 24 horas",
            items: [
              "Montaje de servicios críticos desde los respaldos.",
              "Evaluar el alcance del daño.",
              "Activación del “modo operativo mínimo tecnológico”.",
              "Coordinación con MICITT y CSIRT-CR (Centros de respuesta).",
            ],
          },
          {
            heading: "Recuperación",
            items: [
              "Restauración total de los sistemas.",
              "Verificación de la integridad de datos.",
              "Refuerzo de medidas de ciberseguridad.",
              "Informe técnico de las dependencias competentes.",
            ],
          },
        ],
        committees: [
          "COSI (central)",
          "Tecnologías de Información (líder operativo)",
          "CICO (coordinación estratégica)",
          "Comité de Mando (si afecta sesiones legislativas)",
        ],
      },

      {
        id: "sanitarios",
        title: "PLAN DE RESPUESTA ANTE EVENTOS SANITARIOS / BIOLÓGICOS",
        subtitle: "PLANES ESPECÍFICOS POR EVENTO DISRUPTIVO",
        objective:
          "Proteger la salud del personal y asegurar continuidad del servicio durante brotes infecciosos, epidemias o emergencias de salud ocupacional.",
        scenarios: [
          "Enfermedades respiratorias contagiosas.",
          "Enfermedades transmitidas por vector.",
          "Brotes en una unidad específica.",
          "Afectación de personal crítico.",
        ],
        sections: [
          {
            heading: "Activación inicial",
            items: [
              "Servicios de Salud detecta el caso.",
              "Notifica a RRHH y Gerencia General.",
            ],
          },
          {
            heading: "Acciones inmediatas",
            items: [
              "Aislamiento de las personas afectadas.",
              "Identificación de contactos dentro de la institución.",
              "Activación de teletrabajo para puestos posibles.",
              "Priorización del personal esencial.",
              "Limpieza y desinfección de las áreas expuestas.",
            ],
          },
          {
            heading: "Acciones de las primeras 24 horas",
            items: [
              "Evaluación del riesgo por parte del Departamento de Servicios de Salud.",
              "Reubicación de servicios críticos.",
              "Ajuste de turnos y suplencias.",
            ],
          },
          {
            heading: "Recuperación",
            items: [
              "Reintegración gradual del personal.",
              "Evaluación post-evento del Departamento de Servicios de Salud.",
              "Ajustes a protocolos sanitarios (en caso de ser necesario).",
            ],
          },
        ],
        committees: [
          "Comité de Mando",
          "CICO",
          "CIE (si hay traslado de personal o evacuación)",
        ],
      },

      {
        id: "seguridad-fisica",
        title: "PLAN ANTE EVENTOS DE SEGURIDAD FÍSICA",
        subtitle: "PLANES ESPECÍFICOS POR EVENTO DISRUPTIVO",
        objective:
          "Proteger la integridad de personas, infraestructura parlamentaria, bienes institucionales y continuidad de actividades legislativas.",
        scenarios: [
          "Amenaza directa contra personas o instalaciones.",
          "Intrusión en los edificios legislativos.",
          "Alteraciones del orden interno.",
          "Sabotaje físico.",
          "Manifestaciones con riesgo de violencia.",
        ],
        sections: [
          {
            heading: "Activación inicial",
            items: [
              "Seguridad Parlamentaria detecta el incidente.",
              "Control de accesos inmediato.",
              "Comunicación al CICO y a la Gerencia General.",
            ],
          },
          {
            heading: "Acciones inmediatas",
            items: [
              "Contención y aislamiento de la zona.",
              "Evacuación o confinamiento según el tipo de amenaza.",
              "Coordinación con Fuerza Pública.",
              "Protección prioritaria del Directorio legislativo, Plenario y Gerencia General (cuarto de pánico).",
              "Activación de protocolos ante necesidad de continuar sesiones en modalidad alterna.",
            ],
          },
          {
            heading: "Acciones de las primeras 24 horas",
            items: [
              "Revisión de cámaras y registros.",
              "Reubicación del personal en zonas seguras.",
              "Emitir comunicados oficiales sobre el estado del evento.",
            ],
          },
          {
            heading: "Recuperación",
            items: [
              "Informe del Departamento de Seguridad Parlamentaria.",
              "Ajustes a accesos y medidas permanentes.",
              "Seguimiento con Fuerza Pública si corresponde.",
            ],
          },
        ],
        committees: ["CIE"],
      },

      {
        id: "ambientales",
        title: "PLAN ANTE EVENTOS AMBIENTALES / ECOLÓGICOS",
        subtitle: "PLANES ESPECÍFICOS POR EVENTO DISRUPTIVO",
        objective:
          "Gestionar emergencias relacionadas con residuos, contaminación, derrames, calidad del aire y afectación ambiental dentro del complejo legislativo.",
        scenarios: [
          "Derrame de químicos o materiales peligrosos.",
          "Contaminación del agua o ventilación.",
          "Afectaciones por humo o partículas.",
        ],
        sections: [
          {
            heading: "Activación inicial",
            items: [
              "Cualquier dependencia institucional puede detectar el evento.",
              "CIE es notificado de inmediato.",
            ],
          },
          {
            heading: "Acciones inmediatas",
            items: [
              "Aislamiento del área contaminada.",
              "Uso de equipos de protección personal (EPP).",
              "Corte preventivo de ventilación (si corresponde).",
              "Coordinación con Bomberos y Ministerio de Salud.",
            ],
          },
          {
            heading: "Acciones de las primeras 24 horas",
            items: [
              "Verificación de zonas seguras.",
              "Transporte seguro de los residuos contaminados.",
              "Reasignación de oficinas afectadas.",
            ],
          },
          {
            heading: "Recuperación",
            items: [
              "Limpieza técnica especializada.",
              "Validación final por Gestión Ambiental.",
              "Informe con acciones correctivas.",
            ],
          },
        ],
        committees: ["CISAAL"],
      },

      {
        id: "politica",
        title: "PLAN ANTE EVENTOS DE NATURALEZA POLÍTICA",
        subtitle: "PLANES ESPECÍFICOS POR EVENTO DISRUPTIVO",
        objective:
          "Garantizar la continuidad del servicio legislativo y administrativo ante eventos de naturaleza política que puedan afectar el funcionamiento del Plenario o Comisiones Legislativas, interrumpir el acceso seguro a las instalaciones, generar alteraciones en el orden público, comprometer la estabilidad operativa de la Asamblea, afectar a diputaciones, funcionarios y usuarios, o influir en la percepción pública del Poder Legislativo.\n\nEste plan busca asegurar que la Asamblea Legislativa siga operando de manera segura, ordenada y conforme a derecho, sin comprometer la institucionalidad democrática.",
        scenarios: [
          "Manifestaciones públicas masivas en las inmediaciones del Congreso que afecten los accesos, la seguridad perimetral y/o funcionamiento normal de los órganos legislativos.",
          "Bloqueos de acceso o tránsito, donde los cierres en Cuesta de Moras, Avenida Central, Parque Nacional o vías aledañas que impidan el desplazamiento de personal crítico.",
          "Presión o riesgo político directo mediante actos simbólicos o presiones externas que puedan impedir sesiones legislativas y/o afectar el trabajo técnico.",
          "Amenazas a la seguridad de diputaciones o personas funcionarias donde se presenten incidentes que requieran reforzar la seguridad, control de los accesos o cierres temporales.",
          "Riesgo reputacional o de desinformación política cuando la circulación de información sea falsa o manipulada y afecte el orden institucional.",
          "Tensiones políticas que generen fraccionamiento operativo, retrasos en toma de decisiones y/o bloqueo procedimental o administrativo.",
        ],
        activation: [
          "El Departamento de Seguridad Parlamentaria detecte alteraciones en el entorno político que comprometan el funcionamiento institucional.",
          "El Comité Institucional de Emergencias (CIE) determine riesgo potencial para acceso o permanencia en instalaciones.",
          "El Comité de Mando considere que la situación puede escalar.",
          "El Directorio Legislativo declare alteración relevante del orden institucional.",
        ],
        sections: [
          {
            heading: "Activación inicial",
            items: ["El plan se activa cuando:"],
          },
          {
            heading: "Acciones inmediatas",
            items: [
              "1. Seguridad Parlamentaria",
              "Evaluar el perímetro y accesos.",
              "Determinar los puntos críticos y las rutas seguras.",
              "Activar cierres selectivos (si es necesario).",
              "Garantizar ingreso del personal crítico identificado en el PCSAL.",
              "2. Comité de Mando",
              "Establecer el Puesto de Mando (presencial o virtual).",
              "Activar protocolos de seguridad física y control de flujos.",
              "Coordinar con Fuerza Pública y Tránsito según corresponda.",
              "Confirmar la activación del PCSAL.",
              "Establecer prioridades institucionales inmediatas.",
              "3. CICO",
              "Activar los protocolos establecidos por las diferentes dependencias institucionales para la ejecución de las estrategias de continuidad.",
              "4. Prensa Institucional",
              "Emitir comunicación oficial clara, precisa y no partidista.",
              "Evitar rumores y desinformación.",
              "Coordinar mensajes con Gerencia General y Directorio Legislativo.",
            ],
          },
          {
            heading: "Acciones de las primeras 24 horas",
            items: [
              "Garantizar continuidad legislativa evaluando si el Plenario puede sesionar de forma presencial, semipresencial, reubicado o si se debe reprogramar las sesiones de los órganos legislativos en formato seguro.",
              "Reforzar la seguridad mediante la ampliación de perímetros, control de los ingresos y coordinación de manera permanente con el Ministerio de Seguridad Pública (MSP).",
              "Comunicar de forma continua actualizaciones oficiales cada hora para controlar la desinformación.",
              "El Área de Control interno y Gestión del Riesgo Institucional debe verificar la legalidad de todas las actuaciones y documentar las decisiones institucionales.",
              "Brindar acompañamiento a diputaciones previamente coordinado con las Jefaturas de Fracción para valorar la necesidad de escoltas o ingreso prioritario.",
            ],
          },
          {
            heading: "Recuperación",
            items: [
              "Llevar a cabo el restablecimiento operativo, normalizando los accesos, retomando agendas legislativas y restableciendo horarios y servicios.",
              "Realizar una revisión de daños y afectaciones de la seguridad de las instalaciones.",
              "Emitir un informe institucional que integre las disposiciones del Comité de Mando y las valoraciones técnicas del CICO.",
              "Ajustar los protocolos de seguridad y comunicación, establecer mejoras en rutas alternas y mecanismos de control, así como fortalecer la gestión de riesgos institucionales (de ser necesario).",
            ],
          },
        ],
        committees: [
          "Comité de Mando",
          "Comité Institucional de Emergencias (CIE)",
          "Comité Institucional de Continuidad del Servicio (CICO)",
        ],
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<Plan["id"]>("naturales");
  const activePlan = plans.find((p) => p.id === activeId) ?? plans[0];
  const meta = planMeta[activePlan.id];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header neutral */}
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Resumen de eventos críticos
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">
                Planes específicos por evento disruptivo
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seleccioná un plan para ver objetivo, escenarios y acciones por
                fase (activación, inmediatas, primeras 24 horas y recuperación).
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
              <span className="grid place-content-center rounded-full bg-slate-900 text-white p-1">
                {meta.icon}
              </span>
              <span className="font-medium">{meta.short}</span>
            </div>
          </div>

          <div role="tablist" aria-label="Planes" className="flex flex-wrap gap-2 pt-2">
            {plans.map((p) => (
              <TabButton
                key={p.id}
                id={p.id}
                active={p.id === activeId}
                label={planMeta[p.id].short}
                onClick={() => setActiveId(p.id)}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <section role="tabpanel" aria-label={activePlan.title} className="mt-6 space-y-6">
         <InfoCard title="Objetivo">
    {activePlan.objective.split("\n\n").map((p, idx) => (
      <p key={idx} className="text-sm text-slate-700 leading-relaxed">
        {p}
      </p>
    ))}
  </InfoCard>

        <InfoCard title="Escenarios previstos">
          <BulletList items={activePlan.scenarios} />
        </InfoCard>

        {activePlan.activation ? (
          <InfoCard title="Activación inicial">
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              El plan se activa cuando:
            </p>
            <BulletList items={activePlan.activation} />
          </InfoCard>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {activePlan.sections.map((sec) => (
            <InfoCard key={sec.heading} title={sec.heading}>
              <BulletList items={sec.items} />
            </InfoCard>
          ))}
        </div>

        {activePlan.committees?.length ? (
          <InfoCard title="Comités involucrados">
            <BulletList items={activePlan.committees} />
          </InfoCard>
        ) : null}
      </section>
    </main>
  );
}

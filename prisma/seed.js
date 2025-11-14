const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const areas = [
    { id: "1", label: "Todo el departamento" },
    { id: "2", label: "Gerencia General" },
    { id: "3", label: "Gerencia Técnico Operativa" },
    { id: "4", label: "Departamento de Desarrollo Sostenible" },
    { id: "5", label: "Departamento de Tecnologías de información" },
    { id: "6", label: "Departamento de Protocolo" },
    { id: "7", label: "Departamento de Asesoría Legal" },
    { id: "8", label: "Departamento de Prensa Institucional" },
    { id: "9", label: "Departamento de Seguridad Parlamentaria" },
    { id: "10", label: "Departamento de Instituto de Formación e Investigación" },
    { id: "11", label: "Departamento Análisis Presupuestario" },
    { id: "12", label: "Departamento de Comisiones Legislativas" },
    { id: "13", label: "Departamento de __________________" },
    { id: "14", label: "Departamento de Financiero" },
    { id: "15", label: "Departamento de Servicios Generales" },
    { id: "16", label: "Departamento de Proveeduría" },
    { id: "17", label: "Departamento de Recursos Humanos" },
    { id: "18", label: "Departamento de Servicios de Salud" },
    { id: "19", label: "Comité Institucional de Emergencias" },
  ];

  await prisma.area.createMany({ data: areas, skipDuplicates: true });

  const impactos = [
    { name: "Operativo" },
    { name: "Financiero" },
    { name: "Reputacional" },
    { name: "Regulatorio/Legal" },
    { name: "Tecnológico" },
    { name: "Seguridad de la Información" },
    { name: "Ambiental" },
    { name: "A la cuidadanía" },
  ];

  await prisma.impactType.createMany({ data: impactos, skipDuplicates: true });

  const subareas = [
    { id: "gestion-pagos-tesoreria", label: "Área de gestión de pagos y tesorería", areaId: "14" },
    { id: "planilla-diputados", label: "Área de planilla de diputados", areaId: "14" },
    { id: "presupuesto", label: "Área de presupuesto", areaId: "14" },
    { id: "contabilidad", label: "Área de contabilidad", areaId: "14" },

    { id: "compras", label: "Área de compras", areaId: "16" },
    { id: "almacen-suministros-bienes-muebles", label: "Área de almacén de suministros y bienes muebles", areaId: "16" },
    { id: "gestion-control", label: "Área de gestión y control", areaId: "16" },

    { id: "administracion-salarios", label: "Área de administración de salarios", areaId: "17" },

    { id: "aprobacion-seguimiento-evaluacion-presupuesto", label: "Área de aprobación, seguimiento y evaluación del presupuesto", areaId: "11" },

    { id: "procesos-legislativos", label: "Área de procesos legislativos", areaId: "6" },
    { id: "actas-sonido-grabacion", label: "Área de actas, sonido y grabación", areaId: "6" },

    { id: "gestion-asuntos-plenario", label: "Área de gestión de asuntos del plenario", areaId: "2" },

    { id: "todo-departamento-sub", label: "Todo el departamento", areaId: "15" },

    { id: "contratacion-administrativa", label: "Área de contratación administrativa", areaId: "7" },
  ];

  await prisma.subArea.createMany({ data: subareas, skipDuplicates: true });

  console.log("🌱 Datos insertados correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

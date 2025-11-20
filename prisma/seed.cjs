// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de planes...");

  const planesData = [
    {
      id: "1",
      nombre: "Plan de Acción General",
      descripcion: "Plan general de acciones ante incidentes",
    },
    {
      id: "2",
      nombre: "Plan de Recuperación",
      descripcion: "Plan para la recuperación de servicios y procesos",
    },
    {
      id: "3",
      nombre: "Plan de Comunicaciones",
      descripcion: "Plan para la gestión de comunicaciones internas y externas",
    },
  ];

  for (const p of planesData) {
    await prisma.plan.upsert({
      where: { id: p.id },
      update: {
        nombre: p.nombre,
        descripcion: p.descripcion,
      },
      create: p,
    });
  }

  console.log("✅ Seed completado: Planes creados/actualizados.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

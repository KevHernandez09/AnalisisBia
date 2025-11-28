// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1) Crear/actualizar usuario admin
  const adminEmail = "admin@institucion.go.cr";
  const adminPassword = "admin123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Administrador BIA",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Administrador BIA",
    },
  });

  console.log("✅ Usuario admin asegurado en la BD.");

  // 2) Seed de planes (lo que ya tienes)
  const planesData = [
    {
      id: "1",
      nombre: "Plan de Acción General",
      descripcion: "Plan general de acciones ante incidentes",
    },
    {
      id: "2",
      nombre: "Plan de Recuperación",
      descripcion: "Plan para la recuperación de operaciones críticas",
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

  console.log("✅ Seed completado: Usuario y planes creados/actualizados.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

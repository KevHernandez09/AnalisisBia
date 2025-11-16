// prisma/seed.cjs
/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs"); // 👈 aquí el cambio

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de base de datos...");

  const plainPassword = "admin123";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin@institucion.go.cr" },
    update: {},
    create: {
      email: "admin@institucion.go.cr",
      name: "Administrador",
      passwordHash,
    },
  });

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

  for (const a of areas) {
    await prisma.area.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
  }

  console.log("✅ Seed finalizado correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

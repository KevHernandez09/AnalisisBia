-- CreateTable
CREATE TABLE "Estrategia" (
    "id" TEXT NOT NULL,
    "nombreProceso" TEXT NOT NULL,
    "descripcionProceso" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "soluciones" TEXT NOT NULL,
    "recursos" TEXT NOT NULL DEFAULT '',
    "responsabilidades" TEXT NOT NULL DEFAULT '',
    "roles" TEXT NOT NULL DEFAULT '',
    "estructura" TEXT NOT NULL DEFAULT '',
    "actividades" TEXT NOT NULL DEFAULT '',
    "frecuencias" TEXT NOT NULL DEFAULT '',
    "resultados" TEXT NOT NULL DEFAULT '',
    "monitoreo" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estrategia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstrategiaArea" (
    "estrategiaId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "EstrategiaArea_pkey" PRIMARY KEY ("estrategiaId","areaId")
);

-- AddForeignKey
ALTER TABLE "EstrategiaArea" ADD CONSTRAINT "EstrategiaArea_estrategiaId_fkey" FOREIGN KEY ("estrategiaId") REFERENCES "Estrategia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstrategiaArea" ADD CONSTRAINT "EstrategiaArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('Alta', 'Media', 'Baja');

-- CreateTable
CREATE TABLE "ProcesoCritico" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "entradas" TEXT NOT NULL DEFAULT '',
    "salidas" TEXT NOT NULL DEFAULT '',
    "partes" TEXT NOT NULL DEFAULT '',
    "sincronizacion" TEXT NOT NULL DEFAULT '',
    "rto" TEXT NOT NULL DEFAULT '',
    "mtpd" TEXT NOT NULL DEFAULT '',
    "rpo" TEXT NOT NULL DEFAULT '',
    "recursos" TEXT NOT NULL DEFAULT '',
    "requisitos" TEXT NOT NULL DEFAULT '',
    "descImpacto" TEXT NOT NULL DEFAULT '',
    "prioridad" "Prioridad" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcesoCritico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpactType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ImpactType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcesoArea" (
    "procesoId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "ProcesoArea_pkey" PRIMARY KEY ("procesoId","areaId")
);

-- CreateTable
CREATE TABLE "ProcesoImpact" (
    "procesoId" TEXT NOT NULL,
    "impactTypeId" INTEGER NOT NULL,

    CONSTRAINT "ProcesoImpact_pkey" PRIMARY KEY ("procesoId","impactTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_label_key" ON "Area"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ImpactType_name_key" ON "ImpactType"("name");

-- AddForeignKey
ALTER TABLE "ProcesoArea" ADD CONSTRAINT "ProcesoArea_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "ProcesoCritico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoArea" ADD CONSTRAINT "ProcesoArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoImpact" ADD CONSTRAINT "ProcesoImpact_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "ProcesoCritico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoImpact" ADD CONSTRAINT "ProcesoImpact_impactTypeId_fkey" FOREIGN KEY ("impactTypeId") REFERENCES "ImpactType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

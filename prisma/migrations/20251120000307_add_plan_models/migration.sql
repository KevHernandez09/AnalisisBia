-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanAccion" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "acciones" TEXT NOT NULL,
    "marcoLegalidad" TEXT NOT NULL,
    "afectacionMarco" TEXT NOT NULL,
    "coordinacion" TEXT NOT NULL,
    "areaContacto" TEXT NOT NULL,
    "requerimientos" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanAccion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanAccion" ADD CONSTRAINT "PlanAccion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

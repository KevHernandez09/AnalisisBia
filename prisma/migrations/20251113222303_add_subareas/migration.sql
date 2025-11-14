-- CreateTable
CREATE TABLE "SubArea" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "SubArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcesoSubarea" (
    "procesoId" TEXT NOT NULL,
    "subareaId" TEXT NOT NULL,

    CONSTRAINT "ProcesoSubarea_pkey" PRIMARY KEY ("procesoId","subareaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubArea_label_key" ON "SubArea"("label");

-- AddForeignKey
ALTER TABLE "ProcesoSubarea" ADD CONSTRAINT "ProcesoSubarea_procesoId_fkey" FOREIGN KEY ("procesoId") REFERENCES "ProcesoCritico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoSubarea" ADD CONSTRAINT "ProcesoSubarea_subareaId_fkey" FOREIGN KEY ("subareaId") REFERENCES "SubArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

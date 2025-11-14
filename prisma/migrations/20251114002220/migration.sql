/*
  Warnings:

  - You are about to drop the column `label` on the `SubArea` table. All the data in the column will be lost.
  - Added the required column `departamentoId` to the `SubArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `SubArea` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SubArea_label_key";

-- AlterTable
ALTER TABLE "SubArea" DROP COLUMN "label",
ADD COLUMN     "departamentoId" TEXT NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Departamento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Departamento_nombre_key" ON "Departamento"("nombre");

-- AddForeignKey
ALTER TABLE "SubArea" ADD CONSTRAINT "SubArea_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

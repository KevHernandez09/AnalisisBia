/*
  Warnings:

  - You are about to drop the `Departamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcesoSubarea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubArea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProcesoSubarea" DROP CONSTRAINT "ProcesoSubarea_procesoId_fkey";

-- DropForeignKey
ALTER TABLE "ProcesoSubarea" DROP CONSTRAINT "ProcesoSubarea_subareaId_fkey";

-- DropForeignKey
ALTER TABLE "SubArea" DROP CONSTRAINT "SubArea_departamentoId_fkey";

-- DropTable
DROP TABLE "Departamento";

-- DropTable
DROP TABLE "ProcesoSubarea";

-- DropTable
DROP TABLE "SubArea";

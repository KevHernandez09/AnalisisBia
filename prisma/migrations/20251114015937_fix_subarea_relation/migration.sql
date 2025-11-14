/*
  Warnings:

  - Added the required column `areaId` to the `SubArea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubArea" ADD COLUMN     "areaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SubArea" ADD CONSTRAINT "SubArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

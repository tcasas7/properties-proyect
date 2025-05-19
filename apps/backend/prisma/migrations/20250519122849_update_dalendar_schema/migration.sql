/*
  Warnings:

  - The primary key for the `Calendar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `available` on the `Calendar` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,propertyId]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_pkey",
DROP COLUMN "available",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Calendar_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_date_propertyId_key" ON "Calendar"("date", "propertyId");

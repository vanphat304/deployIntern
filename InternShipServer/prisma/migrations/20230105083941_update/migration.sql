/*
  Warnings:

  - You are about to drop the column `reasonRejct` on the `studentapplyjobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "studentapplyjobs" DROP COLUMN "reasonRejct",
ADD COLUMN     "reasonReject" TEXT;

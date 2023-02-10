/*
  Warnings:

  - You are about to drop the column `address` on the `studenprosal` table. All the data in the column will be lost.
  - You are about to drop the column `scalse` on the `studenprosal` table. All the data in the column will be lost.
  - You are about to drop the column `specializeCopany` on the `studenprosal` table. All the data in the column will be lost.
  - You are about to drop the `decriptioninternshippositions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "decriptioninternshippositions" DROP CONSTRAINT "decriptioninternshippositions_idStudentProposalCompany_fkey";

-- AlterTable
ALTER TABLE "studenprosal" DROP COLUMN "address",
DROP COLUMN "scalse",
DROP COLUMN "specializeCopany",
ADD COLUMN     "addressCompany" TEXT,
ADD COLUMN     "addressIntern" TEXT,
ADD COLUMN     "introducePosition" TEXT,
ADD COLUMN     "legalRepresentative" TEXT,
ADD COLUMN     "referenceEmail" TEXT,
ADD COLUMN     "referenceName" TEXT,
ADD COLUMN     "referencePhoneNumber" TEXT,
ADD COLUMN     "scale" "ScaleCompany" NOT NULL DEFAULT 'LARGE',
ADD COLUMN     "specializeCompany" TEXT,
ADD COLUMN     "week1" TEXT,
ADD COLUMN     "week2" TEXT,
ADD COLUMN     "week3" TEXT,
ADD COLUMN     "week4" TEXT,
ADD COLUMN     "week5" TEXT,
ADD COLUMN     "week6" TEXT,
ADD COLUMN     "week7" TEXT,
ADD COLUMN     "week8" TEXT;

-- DropTable
DROP TABLE "decriptioninternshippositions";

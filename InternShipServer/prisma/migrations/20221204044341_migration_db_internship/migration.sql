-- CreateEnum
CREATE TYPE "Major" AS ENUM ('INFORMATION_SYSTEM', 'SOFTWARE_TECHNOLOGY', 'NETWORK_SCURITY', 'DATA_ANALYS');

-- CreateEnum
CREATE TYPE "ScaleCompany" AS ENUM ('SMALL', 'SMALLMEDIUM', 'MEDIUM', 'MEDIUMLARGE', 'LARGE', 'LARGESUPER');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'APPROPVED', 'REJECTED', 'SUMBMITED');

-- CreateEnum
CREATE TYPE "RATING" AS ENUM ('NONE', 'BAD', 'PRRETTYBAD', 'MEDIUM', 'GOOD', 'PERTTYGOOD');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "identifierStudent" VARCHAR(12) NOT NULL,
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "username" TEXT NOT NULL,
    "passwordHashed" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "class" VARCHAR(20) NOT NULL,
    "majors" "Major" NOT NULL DEFAULT 'INFORMATION_SYSTEM',
    "email" TEXT,
    "phoneNumber" VARCHAR(10),
    "anotherContact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studenprosal" (
    "id" TEXT NOT NULL,
    "nameCompany" TEXT,
    "address" TEXT NOT NULL,
    "scalse" "ScaleCompany" NOT NULL DEFAULT 'LARGE',
    "introduceCompany" TEXT,
    "linkWebsite" TEXT,
    "specializeCopany" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'SUMBMITED',

    CONSTRAINT "studenprosal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decriptioninternshippositions" (
    "id" TEXT NOT NULL,
    "idStudentProposalCompany" TEXT NOT NULL,
    "week1" TEXT,
    "week2" TEXT,
    "week3" TEXT,
    "week4" TEXT,
    "week5" TEXT,
    "week6" TEXT,
    "week7" TEXT,
    "week8" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decriptioninternshippositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companys" (
    "id" TEXT NOT NULL,
    "nameCompany" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "scale" "ScaleCompany" NOT NULL DEFAULT 'SMALLMEDIUM',
    "address" TEXT NOT NULL,
    "introduce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobdecriptions" (
    "jobId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "decriptionJob" TEXT NOT NULL,
    "salary" DECIMAL(65,30),
    "numberRecur" INTEGER,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "timeStartApply" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "timeEndAppply" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "timeToIntverview" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "addressToInterview" TEXT,

    CONSTRAINT "jobdecriptions_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "studentapplyjobs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "dateAppply" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileCV" TEXT NOT NULL,
    "fileScore" TEXT NOT NULL,
    "status" "STATUS" DEFAULT 'SUMBMITED',

    CONSTRAINT "studentapplyjobs_pkey" PRIMARY KEY ("jobId","studentId")
);

-- CreateTable
CREATE TABLE "resultapplyjob" (
    "id" TEXT NOT NULL,
    "idJobApply" TEXT NOT NULL,
    "status" "STATUS" DEFAULT 'SUMBMITED',
    "timeStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,

    CONSTRAINT "resultapplyjob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentworkcompanys" (
    "studentId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "rating" "RATING" NOT NULL DEFAULT 'NONE',
    "decription" TEXT NOT NULL,

    CONSTRAINT "studentworkcompanys_pkey" PRIMARY KEY ("studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_identifierStudent_key" ON "students"("identifierStudent");

-- CreateIndex
CREATE UNIQUE INDEX "students_username_key" ON "students"("username");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_class_idx" ON "students"("class");

-- CreateIndex
CREATE UNIQUE INDEX "studenprosal_studentId_key" ON "studenprosal"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "decriptioninternshippositions_idStudentProposalCompany_key" ON "decriptioninternshippositions"("idStudentProposalCompany");

-- CreateIndex
CREATE INDEX "companys_nameCompany_idx" ON "companys"("nameCompany");

-- CreateIndex
CREATE INDEX "jobdecriptions_jobTitle_idx" ON "jobdecriptions"("jobTitle");

-- CreateIndex
CREATE UNIQUE INDEX "studentapplyjobs_id_key" ON "studentapplyjobs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "resultapplyjob_idJobApply_key" ON "resultapplyjob"("idJobApply");

-- CreateIndex
CREATE INDEX "resultapplyjob_status_idx" ON "resultapplyjob"("status");

-- CreateIndex
CREATE UNIQUE INDEX "studentworkcompanys_studentId_key" ON "studentworkcompanys"("studentId");

-- CreateIndex
CREATE INDEX "studentworkcompanys_rating_idx" ON "studentworkcompanys"("rating");

-- AddForeignKey
ALTER TABLE "studenprosal" ADD CONSTRAINT "studenprosal_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("identifierStudent") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decriptioninternshippositions" ADD CONSTRAINT "decriptioninternshippositions_idStudentProposalCompany_fkey" FOREIGN KEY ("idStudentProposalCompany") REFERENCES "studenprosal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobdecriptions" ADD CONSTRAINT "jobdecriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentapplyjobs" ADD CONSTRAINT "studentapplyjobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobdecriptions"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentapplyjobs" ADD CONSTRAINT "studentapplyjobs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultapplyjob" ADD CONSTRAINT "resultapplyjob_idJobApply_fkey" FOREIGN KEY ("idJobApply") REFERENCES "studentapplyjobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentworkcompanys" ADD CONSTRAINT "studentworkcompanys_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("identifierStudent") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentworkcompanys" ADD CONSTRAINT "studentworkcompanys_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

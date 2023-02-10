-- CreateEnum
CREATE TYPE "Major" AS ENUM ('INFORMATION_SYSTEM', 'SOFTWARE_TECHNOLOGY', 'NETWORK_SCURITY', 'DATA_ANALYS');

-- CreateEnum
CREATE TYPE "ScaleCompany" AS ENUM ('SMALL', 'SMALLMEDIUM', 'MEDIUM', 'MEDIUMLARGE', 'LARGE', 'LARGESUPER');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('NOT_WORKED', 'APPROPVED', 'REJECTED', 'SUMBMITED', 'WORKED');

-- CreateEnum
CREATE TYPE "RATING" AS ENUM ('NONE', 'BAD', 'PRRETTYBAD', 'MEDIUM', 'GOOD', 'PERTTYGOOD');

-- CreateEnum
CREATE TYPE "WOKINGFORM" AS ENUM ('PART_TIME', 'FULL_TIME');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "notificationStudents" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "note" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificationStudents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecializeCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpecializeCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "identifierStudent" VARCHAR(12),
    "firstName" VARCHAR(50),
    "lastName" VARCHAR(50),
    "passwordHashed" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "dateOfBirth" TIMESTAMP(3),
    "address" TEXT,
    "class" VARCHAR(20),
    "majors" "Major" DEFAULT 'INFORMATION_SYSTEM',
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
    "introduceCompany" TEXT,
    "scale" "ScaleCompany" NOT NULL DEFAULT 'LARGE',
    "addressCompany" TEXT,
    "legalRepresentative" TEXT,
    "introducePosition" TEXT,
    "referenceName" TEXT,
    "referenceEmail" TEXT,
    "referencePhoneNumber" TEXT,
    "addressIntern" TEXT,
    "linkWebsite" TEXT,
    "speacialize" TEXT NOT NULL,
    "addressProvinceId" TEXT NOT NULL,
    "addressDistrictId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "week1" TEXT,
    "week2" TEXT,
    "week3" TEXT,
    "week4" TEXT,
    "week5" TEXT,
    "week6" TEXT,
    "week7" TEXT,
    "week8" TEXT,
    "status" "STATUS" NOT NULL DEFAULT 'SUMBMITED',
    "reasonReject" TEXT,

    CONSTRAINT "studenprosal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companys" (
    "id" TEXT NOT NULL,
    "nameCompany" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "banner" TEXT,
    "scale" "ScaleCompany" NOT NULL DEFAULT 'SMALLMEDIUM',
    "website" TEXT DEFAULT 'https://vi.wikipedia.org/wiki/Son_Goku',
    "specializeCompanyId" TEXT NOT NULL,
    "address" TEXT,
    "isStudentProp" BOOLEAN DEFAULT false,
    "addressProvinceId" TEXT NOT NULL,
    "addressDistrictId" TEXT NOT NULL,
    "introduce" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobdecriptions" (
    "jobId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "decriptionJob" TEXT NOT NULL,
    "salary" DOUBLE PRECISION,
    "numberRecur" DOUBLE PRECISION,
    "workingForm" "WOKINGFORM" DEFAULT 'PART_TIME',
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
CREATE TABLE "studentlikeJobs" (
    "jobId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studentlikeJobs_pkey" PRIMARY KEY ("jobId","studentId")
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
    "reasonReject" TEXT,

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
    "flag" TEXT,

    CONSTRAINT "studentworkcompanys_pkey" PRIMARY KEY ("studentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_identifierStudent_key" ON "students"("identifierStudent");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_class_idx" ON "students"("class");

-- CreateIndex
CREATE UNIQUE INDEX "studenprosal_studentId_key" ON "studenprosal"("studentId");

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
ALTER TABLE "notificationStudents" ADD CONSTRAINT "notificationStudents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studenprosal" ADD CONSTRAINT "studenprosal_speacialize_fkey" FOREIGN KEY ("speacialize") REFERENCES "SpecializeCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studenprosal" ADD CONSTRAINT "studenprosal_addressProvinceId_fkey" FOREIGN KEY ("addressProvinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studenprosal" ADD CONSTRAINT "studenprosal_addressDistrictId_fkey" FOREIGN KEY ("addressDistrictId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studenprosal" ADD CONSTRAINT "studenprosal_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companys" ADD CONSTRAINT "companys_specializeCompanyId_fkey" FOREIGN KEY ("specializeCompanyId") REFERENCES "SpecializeCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companys" ADD CONSTRAINT "companys_addressProvinceId_fkey" FOREIGN KEY ("addressProvinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companys" ADD CONSTRAINT "companys_addressDistrictId_fkey" FOREIGN KEY ("addressDistrictId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobdecriptions" ADD CONSTRAINT "jobdecriptions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentlikeJobs" ADD CONSTRAINT "studentlikeJobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobdecriptions"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentlikeJobs" ADD CONSTRAINT "studentlikeJobs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentapplyjobs" ADD CONSTRAINT "studentapplyjobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobdecriptions"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentapplyjobs" ADD CONSTRAINT "studentapplyjobs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultapplyjob" ADD CONSTRAINT "resultapplyjob_idJobApply_fkey" FOREIGN KEY ("idJobApply") REFERENCES "studentapplyjobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentworkcompanys" ADD CONSTRAINT "studentworkcompanys_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentworkcompanys" ADD CONSTRAINT "studentworkcompanys_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

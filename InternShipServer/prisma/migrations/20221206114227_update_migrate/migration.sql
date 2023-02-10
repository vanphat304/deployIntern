/*
  Warnings:

  - You are about to drop the `NotificationStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NotificationStudent";

-- CreateTable
CREATE TABLE "notificationStudents" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "notificationStudents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notificationStudents" ADD CONSTRAINT "notificationStudents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

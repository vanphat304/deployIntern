-- DropForeignKey
ALTER TABLE "studenprosal" DROP CONSTRAINT "studenprosal_studentId_fkey";

-- AddForeignKey
ALTER TABLE "studenprosal" ADD CONSTRAINT "studenprosal_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

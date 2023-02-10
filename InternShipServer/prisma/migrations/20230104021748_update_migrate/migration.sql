-- AlterTable
ALTER TABLE "notificationStudents" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "studenprosal" ADD COLUMN     "reasonReject" TEXT;

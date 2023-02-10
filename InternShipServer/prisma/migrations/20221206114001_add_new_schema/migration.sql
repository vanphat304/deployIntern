-- CreateTable
CREATE TABLE "NotificationStudent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "NotificationStudent_pkey" PRIMARY KEY ("id")
);

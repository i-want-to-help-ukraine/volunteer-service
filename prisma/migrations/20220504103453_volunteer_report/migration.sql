-- CreateTable
CREATE TABLE "VolunteerReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "paidPositions" TEXT[],
    "paidAmount" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "publishState" TEXT NOT NULL DEFAULT E'DRAFT',
    "publishDate" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VolunteerReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VolunteerReport" ADD CONSTRAINT "VolunteerReport_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

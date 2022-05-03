-- CreateTable
CREATE TABLE "VolunteerReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "publishState" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VolunteerReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProofOfPayment" (
    "id" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "paidAmount" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProofOfPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VolunteerReport" ADD CONSTRAINT "VolunteerReport_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofOfPayment" ADD CONSTRAINT "ProofOfPayment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "VolunteerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

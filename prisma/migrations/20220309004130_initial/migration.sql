-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "verificationState" TEXT NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitiesOnVolunteers" (
    "volunteerId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "CitiesOnVolunteers_pkey" PRIMARY KEY ("volunteerId","cityId")
);

-- CreateTable
CREATE TABLE "ActivitiesOnVolunteers" (
    "volunteerId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "ActivitiesOnVolunteers_pkey" PRIMARY KEY ("volunteerId","activityId")
);

-- CreateTable
CREATE TABLE "VolunteerSocial" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,

    CONSTRAINT "VolunteerSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialProvidersOnVolunteerSocial" (
    "volunteerSocialId" TEXT NOT NULL,
    "socialProviderId" TEXT NOT NULL,

    CONSTRAINT "SocialProvidersOnVolunteerSocial_pkey" PRIMARY KEY ("volunteerSocialId","socialProviderId")
);

-- CreateTable
CREATE TABLE "VolunteerPaymentOption" (
    "id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "volunteerId" TEXT NOT NULL,

    CONSTRAINT "VolunteerPaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentProvidersOnVolunteerPaymentOptions" (
    "volunteerPaymentOptionId" TEXT NOT NULL,
    "paymentProviderId" TEXT NOT NULL,

    CONSTRAINT "PaymentProvidersOnVolunteerPaymentOptions_pkey" PRIMARY KEY ("volunteerPaymentOptionId","paymentProviderId")
);

-- CreateTable
CREATE TABLE "SocialProvider" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "SocialProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentProvider" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "PaymentProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CitiesOnVolunteers" ADD CONSTRAINT "CitiesOnVolunteers_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitiesOnVolunteers" ADD CONSTRAINT "CitiesOnVolunteers_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitiesOnVolunteers" ADD CONSTRAINT "ActivitiesOnVolunteers_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitiesOnVolunteers" ADD CONSTRAINT "ActivitiesOnVolunteers_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerSocial" ADD CONSTRAINT "VolunteerSocial_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProvidersOnVolunteerSocial" ADD CONSTRAINT "SocialProvidersOnVolunteerSocial_volunteerSocialId_fkey" FOREIGN KEY ("volunteerSocialId") REFERENCES "VolunteerSocial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialProvidersOnVolunteerSocial" ADD CONSTRAINT "SocialProvidersOnVolunteerSocial_socialProviderId_fkey" FOREIGN KEY ("socialProviderId") REFERENCES "SocialProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerPaymentOption" ADD CONSTRAINT "VolunteerPaymentOption_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentProvidersOnVolunteerPaymentOptions" ADD CONSTRAINT "PaymentProvidersOnVolunteerPaymentOptions_volunteerPayment_fkey" FOREIGN KEY ("volunteerPaymentOptionId") REFERENCES "VolunteerPaymentOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentProvidersOnVolunteerPaymentOptions" ADD CONSTRAINT "PaymentProvidersOnVolunteerPaymentOptions_paymentProviderI_fkey" FOREIGN KEY ("paymentProviderId") REFERENCES "PaymentProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
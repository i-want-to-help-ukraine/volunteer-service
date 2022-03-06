-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "verificationState" TEXT NOT NULL,
    "socialProviderIds" TEXT[],
    "donationOptionIds" TEXT[],
    "volunteerActivityIds" TEXT[],

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialProvider" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,

    CONSTRAINT "SocialProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationOption" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "valuesIds" TEXT[],

    CONSTRAINT "DonationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationOptionValue" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "DonationOptionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerActivityType" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "VolunteerActivityType_pkey" PRIMARY KEY ("id")
);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const cities = ['Kyiv', 'Kharkov'];
  const activities = ['Food', 'Medicine'];
  const paymentProviders = ['send.monobank.ua'];
  const socialProviders = ['instagram', 'facebook'];
  const contactProviders = ['phone', 'email'];

  const citiesCreate = prisma.city.createMany({
    data: cities.map((city) => ({ title: city })),
  });

  const activitiesCreate = prisma.activity.createMany({
    data: activities.map((activity) => ({ title: activity })),
  });

  const paymentProvidersCreate = prisma.paymentProvider.createMany({
    data: paymentProviders.map((paymentProvider) => ({
      title: paymentProvider,
    })),
  });

  const socialProvidersCreate = prisma.socialProvider.createMany({
    data: socialProviders.map((socialProvider) => ({
      title: socialProvider,
    })),
  });

  const contactProvidersCreate = prisma.contactProvider.createMany({
    data: contactProviders.map((contactProvider) => ({
      title: contactProvider,
    })),
  });

  await Promise.all([
    citiesCreate,
    activitiesCreate,
    paymentProvidersCreate,
    socialProvidersCreate,
    contactProvidersCreate,
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

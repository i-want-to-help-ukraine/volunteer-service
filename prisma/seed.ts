import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as cities from './cities.json';
import { createTestVolunteers } from './seed-helpers';

async function main() {
  const activities = [
    {
      title: 'Help military',
      description: 'Volunteers are supplying equipment to military forces',
    },
    {
      title: 'Help territory defence',
      description:
        'Territory defence are non military people who are fighting with sabotage groups in the city',
    },
    {
      title: 'Help medical workers',
      description:
        'Volunteers are supplying medical workers with medical equipment',
    },
    {
      title: 'Help pets and animals',
      description: 'Volunteers are helping animals',
    },
    {
      title: 'Help evacuated people',
      description: 'Evacuated people are in need of food, medicine, clothes',
    },
    {
      title: 'Help people in danger zone',
      description:
        'People in danger zone need help with food, medicine and evacuation',
    },
    {
      title: 'I am making food',
      description:
        'Volunteers are making food and supplying it to people in need',
    },
    {
      title: 'I am helping with medicine',
      description: 'Volunteers are supplying medicine',
    },
    {
      title: 'I am a driver and I need fuel',
      description: 'Volunteers are delivering across the city',
    },
    {
      title: 'I am a driver and I need fuel',
      description: 'Volunteers are delivering across the city',
    },
  ];
  const paymentProviders = [
    'send.monobank.ua',
    'Bank card',
    'Crypto',
    'PayPal',
  ];
  const socialProviders = ['instagram', 'facebook'];
  const contactProviders = ['phone', 'email'];

  const citiesCreate = prisma.city.createMany({
    data: cities.map(({ city, admin_name }) => ({
      title: city,
      adminName: admin_name,
    })),
  });

  const activitiesCreate = prisma.activity.createMany({
    data: activities.map(({ title, description }) => ({ title, description })),
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

  if (process.env.NODE_ENV === 'dev') {
    await createTestVolunteers();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

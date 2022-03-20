import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import {
  CreateVolunteerContactDto,
  CreateVolunteerPaymentOptionDto,
  CreateVolunteerSocialDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import * as cities from './cities.json';

function getUniqueName(length = 2) {
  return uniqueNamesGenerator({
    dictionaries: [names, names],
    length,
  });
}

const getVolunteerSocial = (
  socialProviderId: string,
): CreateVolunteerSocialDto[] => [
  {
    url: `https://instagram.com/${getUniqueName()}`,
    socialProviderId,
  },
];
const getVolunteerPaymentOption = (
  paymentProviderId: string,
): CreateVolunteerPaymentOptionDto[] => [
  {
    metadata: JSON.stringify({
      url: `https://send.monobank.ua/${getUniqueName()}`,
    }),
    paymentProviderId,
  },
];
const getVolunteerContact = (
  contactProviderId: string,
): CreateVolunteerContactDto[] => [
  {
    metadata: JSON.stringify({
      phoneNumber: '+48 000 000 000',
    }),
    contactProviderId,
  },
];

const getVolunteerData = ({
  cityIds,
  activityIds,
  socialProviderIds,
  contactProviderIds,
  paymentProviderIds,
}) => ({
  authId: getUniqueName(1),
  firstname: getUniqueName(1),
  lastname: getUniqueName(1),
  description: '',
  avatarUrl: 'https://via.placeholder.com/300.png/09f/fff',
  organization: getUniqueName(1),
  cityIds: [cityIds[0]],
  activityIds: [activityIds[0]],
  verificationStatus: 'verified',
  cities: {
    create: [cityIds[0]].map((cityId) => ({
      city: {
        connect: {
          id: cityId,
        },
      },
    })),
  },
  activities: {
    create: [activityIds[0]].map((activityId) => ({
      activity: {
        connect: {
          id: activityId,
        },
      },
    })),
  },
  social: {
    create: getVolunteerSocial(socialProviderIds[0]).map((volunteerSocial) => ({
      url: volunteerSocial.url,
      providerIds: [volunteerSocial.socialProviderId],
      providers: {
        create: {
          socialProvider: {
            connect: {
              id: volunteerSocial.socialProviderId,
            },
          },
        },
      },
    })),
  },
  contacts: {
    create: getVolunteerContact(contactProviderIds[0]).map((contact) => ({
      metadata: JSON.parse(contact.metadata),
      providerIds: [contact.contactProviderId],
      providers: {
        create: {
          contactProvider: {
            connect: {
              id: contact.contactProviderId,
            },
          },
        },
      },
    })),
  },
  paymentOptions: {
    create: getVolunteerPaymentOption(paymentProviderIds[0]).map(
      (paymentOption) => ({
        metadata: JSON.parse(paymentOption.metadata),
        providerIds: [paymentOption.paymentProviderId],
        paymentProviders: {
          create: {
            paymentProvider: {
              connect: {
                id: paymentOption.paymentProviderId,
              },
            },
          },
        },
      }),
    ),
  },
});

async function main() {
  const activities = [
    {
      title: 'Help military',
      description: 'Volunteers are supplying military forces',
    },
    {
      title: 'Help city territory defence',
      description:
        'Territory defence are non military people who are fighting with sabotage groups in the city',
    },
    {
      title: 'Help families',
      description:
        'Many people left without home. Volunteers are helping them.',
    },
    {
      title: 'Help medical workers',
      description: 'Volunteers supplying materials to medical workers',
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

  const cityIds: string[] = (await prisma.city.findMany({})).map(
    (city) => city.id,
  );
  const activityIds: string[] = (await prisma.activity.findMany({})).map(
    (activity) => activity.id,
  );
  const socialProviderIds: string[] = (
    await prisma.socialProvider.findMany({})
  ).map((provider) => provider.id);

  const paymentProviderIds: string[] = (
    await prisma.paymentProvider.findMany({})
  ).map((provider) => provider.id);

  const contactProviderIds: string[] = (
    await prisma.contactProvider.findMany({})
  ).map((provider) => provider.id);

  await Promise.all(
    new Array(10).fill(null).map(() =>
      prisma.volunteer.create({
        data: getVolunteerData({
          cityIds,
          activityIds,
          socialProviderIds,
          paymentProviderIds,
          contactProviderIds,
        }),
      }),
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import {
  CreateVolunteerContactDto,
  CreateVolunteerPaymentOptionDto,
  CreateVolunteerSocialDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
const prisma = new PrismaClient();

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

function getUniqueName(length = 2) {
  return uniqueNamesGenerator({
    dictionaries: [names, names],
    length,
  });
}

const getVolunteerData = ({
  cityIds,
  activityIds,
  socialProviderIds,
  contactProviderIds,
  paymentProviderIds,
}: any) => ({
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

export async function createTestVolunteers() {
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

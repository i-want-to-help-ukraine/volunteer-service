import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ActivityDto,
  AddActivityDto,
  AddContactProviderDto,
  AddPaymentProviderDto,
  AddSocialProviderDto,
  CityDto,
  ContactProviderDto,
  CreateProfileDto,
  PaymentProviderDto,
  SearchVolunteersDto,
  SocialProviderDto,
  UpdateProfileDto,
  VolunteerContactDto,
  VolunteerDto,
  VolunteerPaymentOptionDto,
  VolunteerSocialDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import {
  Volunteer,
  VolunteerContact,
  VolunteerPaymentOption,
  VolunteerSocial,
} from '@prisma/client';
import { VerificationStatus } from '../../enums/verification-status';

@Injectable()
export class VolunteerService {
  private logger = new Logger(VolunteerService.name);

  constructor(private prisma: PrismaService) {}

  async searchVolunteers(request: SearchVolunteersDto): Promise<{
    hasNextPage: boolean;
    volunteers: VolunteerDto[];
  }> {
    try {
      const { cityIds, activityIds, offset, startCursor } = request;

      if (cityIds.length === 0 && activityIds.length === 0) {
        const volunteers = await this.prisma.volunteer.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          take: offset + 1,
          cursor: startCursor
            ? {
                id: startCursor,
              }
            : undefined,
          where: {
            verificationStatus: VerificationStatus.verified,
          },
        });

        return {
          hasNextPage: volunteers.length === offset + 1,
          volunteers: volunteers.map((volunteer) =>
            this.mapVolunteer(volunteer),
          ),
        };
      }

      const volunteers = await this.prisma.volunteer.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        take: offset + 1,
        cursor: startCursor
          ? {
              id: startCursor,
            }
          : undefined,
        where: {
          verificationStatus: VerificationStatus.verified,
          activities:
            activityIds.length > 0
              ? {
                  some: {
                    activity: {
                      id: {
                        in: activityIds,
                      },
                    },
                  },
                }
              : undefined,
          cities:
            cityIds.length > 0
              ? {
                  some: {
                    city: {
                      id: {
                        in: cityIds,
                      },
                    },
                  },
                }
              : undefined,
        },
      });

      return {
        hasNextPage: volunteers.length === offset + 1,
        volunteers: volunteers.map((volunteer) => this.mapVolunteer(volunteer)),
      };
    } catch (e) {
      this.logger.error(e);

      return {
        hasNextPage: false,
        volunteers: [],
      };
    }
  }

  getVolunteersCount(): Promise<number | null> {
    try {
      return this.prisma.volunteer.count({
        where: {
          verificationStatus: VerificationStatus.verified,
        },
      });
    } catch (e) {
      this.logger.error(e);
      return Promise.resolve(null);
    }
  }

  async getCities(): Promise<CityDto[]> {
    try {
      return this.prisma.city.findMany({});
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getCitiesByIds(ids: string[]): Promise<CityDto[]> {
    try {
      return this.prisma.city.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getActivities(): Promise<ActivityDto[]> {
    try {
      return this.prisma.activity.findMany({});
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getActivitiesByIds(ids: string[]): Promise<ActivityDto[]> {
    try {
      return this.prisma.activity.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getSocialProviders(): Promise<SocialProviderDto[]> {
    try {
      return this.prisma.socialProvider.findMany({});
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getSocialProvidersByIds(ids: string[]): Promise<SocialProviderDto[]> {
    try {
      return this.prisma.socialProvider.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getPaymentProviders(): Promise<PaymentProviderDto[]> {
    try {
      return this.prisma.paymentProvider.findMany({});
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getPaymentProvidersByIds(ids: string[]): Promise<PaymentProviderDto[]> {
    try {
      return this.prisma.paymentProvider.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getContactProviders(): Promise<ContactProviderDto[]> {
    try {
      return this.prisma.contactProvider.findMany({});
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getContactProvidersByIds(ids: string[]): Promise<ContactProviderDto[]> {
    try {
      return this.prisma.contactProvider.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getVolunteerSocial(
    volunteerIds: string[],
  ): Promise<VolunteerSocialDto[]> {
    try {
      const volunteerSocial = await this.prisma.volunteerSocial.findMany({
        where: {
          deletedAt: null,
          volunteer: {
            id: {
              in: volunteerIds,
            },
          },
        },
      });

      return volunteerSocial.map((social) => this.mapVolunteerSocial(social));
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getVolunteerPaymentOptions(
    volunteerIds: string[],
  ): Promise<VolunteerPaymentOptionDto[]> {
    try {
      const paymentOptions = await this.prisma.volunteerPaymentOption.findMany({
        where: {
          deletedAt: null,
          volunteer: {
            id: {
              in: volunteerIds,
            },
          },
        },
      });

      return paymentOptions.map((paymentOption) =>
        this.mapVolunteerPaymentOption(paymentOption),
      );
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getVolunteerContacts(
    volunteerIds: string[],
  ): Promise<VolunteerContactDto[]> {
    try {
      const contacts = await this.prisma.volunteerContact.findMany({
        where: {
          deletedAt: null,
          volunteer: {
            id: {
              in: volunteerIds,
            },
          },
        },
      });

      return contacts.map((contact) => this.mapContact(contact));
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getVolunteersByIds(ids: string[]): Promise<VolunteerDto[]> {
    try {
      const volunteers = await this.prisma.volunteer.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return volunteers.map((volunteer) => this.mapVolunteer(volunteer));
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async getVolunteerByAuthId(authId: string): Promise<VolunteerDto | null> {
    try {
      const profile = await this.prisma.volunteer.findUnique({
        where: { authId },
      });

      return profile ? this.mapVolunteer(profile) : null;
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }

  async createProfile(request: CreateProfileDto): Promise<VolunteerDto | null> {
    const {
      authId,
      firstName,
      lastName,
      avatarUrl,
      activityIds,
      social,
      cityIds,
      contacts,
      paymentOptions,
      description,
      organization,
    } = request;

    try {
      const createdVolunteer = await this.prisma.volunteer.create({
        data: {
          authId,
          firstname: firstName,
          lastname: lastName,
          avatarUrl,
          description: description || undefined,
          organization: organization || undefined,
          cityIds,
          activityIds,
          verificationStatus: VerificationStatus.requested,
          cities: {
            create: cityIds.map((cityId) => ({
              city: {
                connect: {
                  id: cityId,
                },
              },
            })),
          },
          activities: {
            create: activityIds.map((activityId) => ({
              activity: {
                connect: {
                  id: activityId,
                },
              },
            })),
          },
          social: {
            create: social.map((volunteerSocial) => ({
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
            create: contacts.map((contact) => ({
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
            create: paymentOptions.map((paymentOption) => ({
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
            })),
          },
        },
      });

      return this.mapVolunteer(createdVolunteer);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async updateProfile(
    request: UpdateProfileDto,
    volunteerProfile: VolunteerDto,
  ): Promise<VolunteerDto | null> {
    try {
      const {
        firstName,
        lastName,
        avatarUrl,
        description,
        organization,
        activityIds,
        cityIds,
        social,
        paymentOptions,
        contacts,
      } = request;

      const activitiesToCreate =
        activityIds.length > 0
          ? activityIds.filter(
              (activityId) =>
                !volunteerProfile.activityIds.includes(activityId),
            )
          : [];
      const activitiesToDelete =
        activityIds.length > 0
          ? volunteerProfile.activityIds.filter(
              (volunteerActivityId) =>
                !activityIds.includes(volunteerActivityId),
            )
          : [];

      const citiesToCreate =
        cityIds.length > 0
          ? cityIds.filter(
              (cityId) => !volunteerProfile.cityIds.includes(cityId),
            )
          : [];
      const citiesToDelete =
        cityIds.length > 0
          ? volunteerProfile.cityIds.filter(
              (cityId) => !cityIds.includes(cityId),
            )
          : [];

      const updatedProfile = await this.prisma.volunteer.update({
        where: {
          id: volunteerProfile.id,
        },
        data: {
          firstname: firstName,
          lastname: lastName,
          description,
          organization,
          avatarUrl,
          activityIds: activityIds.length > 0 ? activityIds : undefined,
          cityIds: cityIds.length > 0 ? cityIds : undefined,
          activities: {
            create: activitiesToCreate.map((activityId) => ({
              activity: {
                connect: {
                  id: activityId,
                },
              },
            })),
            delete: activitiesToDelete.map((activityId) => ({
              volunteerId_activityId: {
                activityId,
                volunteerId: volunteerProfile.id,
              },
            })),
          },
          cities: {
            create: citiesToCreate.map((cityId) => ({
              city: {
                connect: {
                  id: cityId,
                },
              },
            })),
            delete: citiesToDelete.map((cityId) => ({
              volunteerId_cityId: { cityId, volunteerId: volunteerProfile.id },
            })),
          },
          social: {
            create: social
              ? social.create.map(({ url, socialProviderId }) => ({
                  url,
                  providerIds: [socialProviderId],
                }))
              : undefined,
            update: social
              ? social.delete.map((id) => ({
                  where: { id },
                  data: {
                    deletedAt: new Date(),
                  },
                }))
              : undefined,
          },
          paymentOptions: {
            create: paymentOptions
              ? paymentOptions.create.map(
                  ({ metadata, paymentProviderId }) => ({
                    metadata: JSON.parse(metadata),
                    providerIds: [paymentProviderId],
                  }),
                )
              : undefined,
            update: paymentOptions
              ? paymentOptions.delete.map((id) => ({
                  where: { id },
                  data: { deletedAt: new Date() },
                }))
              : undefined,
          },
          contacts: {
            create: contacts
              ? contacts.create.map(({ metadata, contactProviderId }) => ({
                  metadata: JSON.parse(metadata),
                  providerIds: [contactProviderId],
                }))
              : undefined,
            update: contacts
              ? contacts.delete.map((id) => ({
                  where: { id },
                  data: { deletedAt: new Date() },
                }))
              : undefined,
          },
        },
      });

      return this.mapVolunteer(updatedProfile);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async hideVolunteerProfile(authId: string): Promise<VolunteerDto | null> {
    try {
      const profile = await this.prisma.volunteer.update({
        where: {
          authId,
        },
        data: {
          verificationStatus: VerificationStatus.hidden,
        },
      });

      return profile ? this.mapVolunteer(profile) : null;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async changeVolunteerStatus(
    volunteerId: string,
    verificationStatus: VerificationStatus,
  ): Promise<VolunteerDto | null> {
    try {
      const profile = await this.prisma.volunteer.update({
        where: {
          id: volunteerId,
        },
        data: {
          verificationStatus,
        },
      });

      return profile ? this.mapVolunteer(profile) : null;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getRequested(): Promise<VolunteerDto[]> {
    try {
      const volunteers = await this.prisma.volunteer.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          verificationStatus: VerificationStatus.requested,
        },
      });

      return volunteers.map((volunteer) => this.mapVolunteer(volunteer));
    } catch (e) {
      this.logger.error(e);

      return [];
    }
  }

  async addActivity({
    title,
    description,
  }: AddActivityDto): Promise<ActivityDto | null> {
    try {
      return this.prisma.activity.create({
        data: {
          title,
          description,
        },
      });
    } catch (e) {
      this.logger.error(e);

      return null;
    }
  }

  async addPaymentProvider({
    title,
  }: AddPaymentProviderDto): Promise<PaymentProviderDto | null> {
    try {
      return this.prisma.paymentProvider.create({
        data: {
          title,
        },
      });
    } catch (e) {
      this.logger.error(e);

      return null;
    }
  }

  async addContactProvider({
    title,
  }: AddContactProviderDto): Promise<ContactProviderDto | null> {
    try {
      return this.prisma.contactProvider.create({
        data: {
          title,
        },
      });
    } catch (e) {
      this.logger.error(e);

      return null;
    }
  }

  async addSocialProvider({
    title,
  }: AddSocialProviderDto): Promise<SocialProviderDto | null> {
    try {
      return this.prisma.socialProvider.create({
        data: {
          title,
        },
      });
    } catch (e) {
      this.logger.error(e);

      return null;
    }
  }

  private mapVolunteerSocial(
    volunteerSocial: VolunteerSocial,
  ): VolunteerSocialDto {
    const { id, url, volunteerId, providerIds } = volunteerSocial;

    return {
      id,
      url,
      volunteerId,
      providerId: providerIds[0],
    };
  }

  private mapVolunteerPaymentOption(
    volunteerPaymentOption: VolunteerPaymentOption,
  ): VolunteerPaymentOptionDto {
    const { id, metadata, volunteerId, providerIds } = volunteerPaymentOption;

    return {
      id,
      metadata: JSON.stringify(metadata),
      volunteerId,
      providerId: providerIds[0],
    };
  }

  private mapContact(contact: VolunteerContact): VolunteerContactDto {
    const { id, metadata, volunteerId, providerIds } = contact;

    return {
      id,
      metadata: JSON.stringify(metadata),
      volunteerId: volunteerId,
      providerId: providerIds[0],
    };
  }

  private mapVolunteer(volunteer: Volunteer): VolunteerDto {
    const {
      id,
      authId,
      firstname,
      lastname,
      description,
      avatarUrl,
      organization,
      verificationStatus,
      cityIds,
      activityIds,
    } = volunteer;

    return {
      id,
      authId,
      firstName: firstname,
      lastName: lastname,
      description: description || undefined,
      avatarUrl,
      organization: organization || undefined,
      verificationStatus,
      cityIds,
      activityIds,
    };
  }
}

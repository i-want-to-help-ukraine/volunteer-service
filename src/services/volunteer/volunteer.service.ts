import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ActivityDto,
  CityDto,
  PaymentProviderDto,
  VolunteerDto,
  VolunteerPaymentOptionDto,
  VolunteerSocialDto,
  SocialProviderDto,
  CreateProfileDto,
  UpdateProfileDto,
  HideProfileDto,
  SearchVolunteersDto,
  VolunteerContactDto,
  ContactProviderDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import {
  Volunteer,
  VolunteerPaymentOption,
  VolunteerContact,
  VolunteerSocial,
} from '@prisma/client';

@Injectable()
export class VolunteerService {
  private logger = new Logger(VolunteerService.name);

  constructor(private prisma: PrismaService) {}

  async searchVolunteers(
    request: SearchVolunteersDto,
  ): Promise<VolunteerDto[] | null> {
    try {
      const { cityIds, activityIds } = request;

      if (cityIds.length === 0 && activityIds.length === 0) {
        const volunteers = await this.prisma.volunteer.findMany({});
        return volunteers.map((volunteer) => this.mapVolunteer(volunteer));
      }

      const volunteers = await this.prisma.volunteer.findMany({
        where: {
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

      return volunteers.map((volunteer) => this.mapVolunteer(volunteer));
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getCities(): Promise<CityDto[]> {
    try {
      return this.prisma.city.findMany({});
    } catch (e) {
      this.logger.error(e);
      return null;
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
      return null;
    }
  }

  async getActivities(): Promise<ActivityDto[]> {
    try {
      return this.prisma.activity.findMany({});
    } catch (e) {
      this.logger.error(e);
      return null;
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
      return null;
    }
  }

  async getSocialProviders(): Promise<SocialProviderDto[]> {
    try {
      return this.prisma.socialProvider.findMany({});
    } catch (e) {
      this.logger.error(e);
      return null;
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
      return null;
    }
  }

  async getPaymentProviders(): Promise<PaymentProviderDto[]> {
    try {
      return this.prisma.paymentProvider.findMany({});
    } catch (e) {
      this.logger.error(e);
      return null;
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
      return null;
    }
  }

  async getContactProviders(): Promise<ContactProviderDto[]> {
    try {
      return this.prisma.contactProvider.findMany({});
    } catch (e) {
      this.logger.error(e);
      return null;
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
      return null;
    }
  }

  async getVolunteerSocial(
    volunteerIds: string[],
  ): Promise<VolunteerSocialDto[]> {
    try {
      const volunteerSocial = await this.prisma.volunteerSocial.findMany({
        where: {
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
      return null;
    }
  }

  async getVolunteerPaymentOptions(
    volunteerIds: string[],
  ): Promise<VolunteerPaymentOptionDto[]> {
    try {
      const paymentOptions = await this.prisma.volunteerPaymentOption.findMany({
        where: {
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
      return null;
    }
  }

  async getVolunteerContacts(
    volunteerIds: string[],
  ): Promise<VolunteerContactDto[]> {
    try {
      const contacts = await this.prisma.volunteerContact.findMany({
        where: {
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
      return null;
    }
  }

  async getVolunteersByIds(ids: string[]): Promise<VolunteerDto[] | null> {
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
      return null;
    }
  }

  async getVolunteerByAuthId(authId: string): Promise<VolunteerDto | null> {
    try {
      const profile = await this.prisma.volunteer.findFirst({
        where: { authId },
      });

      return this.mapVolunteer(profile);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async createVolunteerProfile(
    request: CreateProfileDto,
  ): Promise<VolunteerDto> {
    const {
      authId,
      firstName,
      lastName,
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
          description,
          organization,
          cityIds,
          activityIds,
          verificationStatus: 'requested',
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

  async updateVolunteerProfile(
    authId: string,
    request: UpdateProfileDto,
  ): Promise<VolunteerDto> {
    try {
      const {
        authId,
        firstName,
        lastName,
        description,
        organization,
        activityIds,
        cityIds,
        social,
        paymentOptions,
        contacts,
      } = request;

      const volunteerProfile = await this.getVolunteerByAuthId(authId);
      const activitiesToCreate = activityIds.filter(
        (activityId) => !volunteerProfile.activityIds.includes(activityId),
      );
      const activitiesToDelete = volunteerProfile.activityIds.filter(
        (activityId) => !activityIds.includes(activityId),
      );

      const citiesToCreate = cityIds.filter(
        (cityId) => !volunteerProfile.cityIds.includes(cityId),
      );
      const citiesToDelete = volunteerProfile.cityIds.filter(
        (cityId) => !cityIds.includes(cityId),
      );

      const updatedProfile = await this.prisma.volunteer.update({
        where: {
          id: volunteerProfile.id,
        },
        data: {
          firstname: firstName,
          lastname: lastName,
          description,
          organization,
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
            create: social.create.map(({ url, socialProviderId }) => ({
              url,
              providerIds: [socialProviderId],
            })),
            delete: social.delete.map((id) => ({ id })),
          },
          paymentOptions: {
            create: paymentOptions.create.map(
              ({ metadata, paymentProviderId }) => ({
                metadata,
                providerIds: [paymentProviderId],
              }),
            ),
            delete: paymentOptions.delete.map((id) => ({ id })),
          },
          contacts: {
            create: contacts.create.map(({ metadata, contactProviderId }) => ({
              metadata,
              providerIds: [contactProviderId],
            })),
            delete: contacts.delete.map((id) => ({ id })),
          },
        },
      });

      return this.mapVolunteer(updatedProfile);
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async hideVolunteerProfile(request: HideProfileDto): Promise<VolunteerDto> {
    try {
      const { id } = request;

      const profile = await this.prisma.volunteer.update({
        where: {
          id,
        },
        data: {
          verificationStatus: 'hidden',
        },
      });

      return this.mapVolunteer(profile);
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
      description,
      organization,
      verificationStatus,
      cityIds,
      activityIds,
    };
  }
}

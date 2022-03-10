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
  CreateVolunteerDto,
  SearchVolunteersDto,
  VolunteerContactDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import {
  Volunteer,
  City,
  VolunteerPaymentOption,
  VolunteerContact,
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

      const volunteers = await this.prisma.volunteer.findMany({
        where: {
          activities: {
            some: {
              activity: {
                id: {
                  in: activityIds,
                },
              },
            },
          },
          cities: {
            some: {
              city: {
                id: {
                  in: cityIds,
                },
              },
            },
          },
        },
      });

      return volunteers.map((volunteer) => this.mapVolunteer(volunteer));
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getCities(): Promise<City[]> {
    try {
      return this.prisma.city.findMany({});
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

  async getActivities(): Promise<ActivityDto[]> {
    try {
      return this.prisma.activity.findMany({});
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

  async getVolunteerCities(volunteerIds: string[]): Promise<CityDto[]> {
    try {
      return this.prisma.city.findMany({
        where: {
          volunteers: {
            some: {
              volunteer: {
                id: {
                  in: volunteerIds,
                },
              },
            },
          },
        },
      });
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getVolunteerActivities(volunteerIds: string[]): Promise<ActivityDto[]> {
    try {
      return this.prisma.activity.findMany({
        where: {
          volunteers: {
            some: {
              volunteer: {
                id: {
                  in: volunteerIds,
                },
              },
            },
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
      return this.prisma.volunteerSocial.findMany({
        where: {
          volunteer: {
            id: {
              in: volunteerIds,
            },
          },
        },
      });
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

  async createVolunteer(request: CreateVolunteerDto): Promise<VolunteerDto> {
    const {
      firstname,
      lastname,
      activityIds,
      social,
      cityIds,
      contacts,
      paymentOptions,
    } = request;

    try {
      const createdVolunteer = await this.prisma.volunteer.create({
        data: {
          firstname,
          lastname,
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
              metadata: contact.metadata,
              contactProviders: {
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
              metadata: paymentOption.metadata,
              paymentProviders: {
                create: {
                  paymentProvider: {
                    connect: {
                      id: paymentOption.paymentOptionId,
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

  private mapVolunteerPaymentOption(
    volunteerPaymentOption: VolunteerPaymentOption,
  ): VolunteerPaymentOptionDto {
    const { id, volunteerId } = volunteerPaymentOption;

    return {
      id,
      metadata: null,
      volunteerId,
    };
  }

  private mapContact(contact: VolunteerContact): VolunteerContactDto {
    const { id } = contact;

    return {
      id,
      metadata: null,
      volunteerId: contact.volunteerId,
    };
  }

  private mapVolunteer(volunteer: Volunteer): VolunteerDto {
    const { id, firstname, lastname, verificationStatus } = volunteer;

    return {
      id,
      firstname,
      lastname,
      verificationStatus,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ActivityDto,
  CityDto,
  PaymentProviderDto,
  SearchVolunteersRequest,
  VolunteerDto,
  VolunteerPaymentOptionDto,
  VolunteerSocialDto,
  SocialProviderDto,
  CreateVolunteerDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import { Volunteer, City, VolunteerPaymentOption } from '@prisma/client';

@Injectable()
export class VolunteerService {
  private logger = new Logger(VolunteerService.name);

  constructor(private prisma: PrismaService) {}

  async searchVolunteers(
    request: SearchVolunteersRequest,
  ): Promise<VolunteerDto[] | null> {
    try {
      const volunteers = await this.prisma.volunteer.findMany({});

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

  async getVolunteerCities(volunteerId: string): Promise<CityDto[]> {
    try {
      return this.prisma.city.findMany({
        where: {
          volunteers: {
            some: {
              volunteer: {
                id: volunteerId,
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

  async getVolunteerActivities(volunteerId: string): Promise<ActivityDto[]> {
    try {
      return this.prisma.activity.findMany({
        where: {
          volunteers: {
            some: {
              volunteer: {
                id: volunteerId,
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

  async getVolunteerSocial(volunteerId: string): Promise<VolunteerSocialDto[]> {
    try {
      return this.prisma.volunteerSocial.findMany({
        where: {
          volunteerId,
        },
      });
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getVolunteerPaymentOptions(
    volunteerId: string,
  ): Promise<VolunteerPaymentOptionDto[]> {
    try {
      const paymentOptions = await this.prisma.volunteerPaymentOption.findMany({
        where: {
          volunteerId,
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
    console.log('request', request);
    const citiesCreate = request.citiesIds.map((cityId) => ({
      city: {
        connect: {
          id: cityId,
        },
      },
    }));

    const activitiesCreate = request.activitiesIds.map((activityId) => ({
      activity: {
        connect: {
          id: activityId,
        },
      },
    }));

    try {
      const createdVolunteer = await this.prisma.volunteer.create({
        data: {
          name: request.name,
          verificationState: 'requested',
          cities: {
            create: citiesCreate,
          },
          activities: {
            create: activitiesCreate,
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
      metadata: '',
      paymentProviders: null,
      volunteerId,
    };
  }

  private mapVolunteer(volunteer: Volunteer): VolunteerDto {
    const { id, name, verificationState } = volunteer;

    return {
      id,
      name,
      verificationState,
    };
  }
}

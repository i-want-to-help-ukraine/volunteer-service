import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SearchVolunteersRequest,
  VolunteerDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import { Volunteer } from '@prisma/client';

@Injectable()
export class VolunteerService {
  private logger = new Logger(VolunteerService.name);

  constructor(private prisma: PrismaService) {}

  async searchVolunteers(
    request: SearchVolunteersRequest,
  ): Promise<VolunteerDto[] | null> {
    try {
      const { cityIds } = request;

      const volunteers = await this.prisma.volunteer.findMany({
        where: {},
      });

      return volunteers.map((volunteer) => this.mapVolunteer(volunteer));
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

  private mapVolunteer(volunteer: Volunteer): VolunteerDto {
    const { id, name } = volunteer;

    return {
      id,
      name,
      cityIds: [],
      activityIds: [],
      paymentOptionIds: [],
    };
  }
}

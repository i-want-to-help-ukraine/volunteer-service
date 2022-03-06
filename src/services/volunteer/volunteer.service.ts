import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VolunteerDto } from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import { Volunteer } from '@prisma/client';

@Injectable()
export class VolunteerService {
  private logger = new Logger(VolunteerService.name);

  constructor(private prisma: PrismaService) {}

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

  async searchVolunteers(): Promise<VolunteerDto[] | null> {
    try {
      return [];
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  private mapVolunteer(volunteer: Volunteer): VolunteerDto {
    const {
      id,
      name,
      city,
      verificationState,
      socialProviderIds,
      donationOptionIds,
      volunteerActivityIds,
    } = volunteer;

    return {
      id,
      name,
      activities: [],
      donateOptions: [],
    };
  }
}

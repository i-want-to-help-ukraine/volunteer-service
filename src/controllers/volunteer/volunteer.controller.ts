import { Controller } from '@nestjs/common';
import { VolunteerService } from '../../services/volunteer/volunteer.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  SearchVolunteersRequest,
  SearchVolunteersResponse,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @GrpcMethod('VolunteerServiceRPC', 'searchVolunteers')
  async searchVolunteers(
    request: SearchVolunteersRequest,
  ): Promise<SearchVolunteersResponse> {
    const volunteers =
      (await this.volunteerService.searchVolunteers(request)) || undefined;

    return { volunteers };
  }
}

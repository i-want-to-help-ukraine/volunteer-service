import { Controller } from '@nestjs/common';
import { VolunteerService } from '../../services/volunteer/volunteer.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetByIdsRequest,
  SearchVolunteersRequest,
  VolunteerResponse,
  VolunteersResponse,
  ActivitiesResponse,
  PaymentOptionsResponse,
  AddPaymentOptionRequest,
  UpdatePaymentOptionRequest,
  DeletePaymentOptionRequest,
  CitiesResponse,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @GrpcMethod('VolunteerServiceRPC', 'search')
  async search(request: SearchVolunteersRequest): Promise<VolunteersResponse> {
    const volunteers =
      (await this.volunteerService.searchVolunteers(request)) || undefined;

    return { volunteers };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteersByIds')
  async getVolunteersByIds(
    request: GetByIdsRequest,
  ): Promise<VolunteersResponse> {
    const volunteers = await this.volunteerService.getVolunteersByIds(
      request.ids,
    );

    return {
      volunteers,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'addPaymentOption')
  async addPaymentOption(
    request: AddPaymentOptionRequest,
  ): Promise<VolunteerResponse> {
    return {
      volunteer: null,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'updatePaymentOption')
  async updatePaymentOption(
    request: UpdatePaymentOptionRequest,
  ): Promise<VolunteerResponse> {
    return {
      volunteer: null,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'deletePaymentOption')
  async deletePaymentOption(
    request: DeletePaymentOptionRequest,
  ): Promise<VolunteerResponse> {
    return {};
  }

  @GrpcMethod('VolunteerServiceRPC', 'getActivitiesByIds')
  async getActivitiesByIds(
    request: GetByIdsRequest,
  ): Promise<ActivitiesResponse> {
    return {
      activities: [],
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getPaymentOptionsByIds')
  async getPaymentOptionsByIds(
    request: GetByIdsRequest,
  ): Promise<PaymentOptionsResponse> {
    return {
      paymentOptions: [],
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getCitiesByIds')
  async getCitiesByIds(request: GetByIdsRequest): Promise<CitiesResponse> {
    return {
      cities: [],
    };
  }
}

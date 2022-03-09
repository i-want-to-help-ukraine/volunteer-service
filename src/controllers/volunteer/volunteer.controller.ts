import { Controller } from '@nestjs/common';
import { VolunteerService } from '../../services/volunteer/volunteer.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetByIdsRequest,
  SearchVolunteersRequest,
  VolunteerResponse,
  VolunteersResponse,
  AddPaymentOptionRequest,
  UpdatePaymentOptionRequest,
  DeletePaymentOptionRequest,
  CitiesResponse,
  ActivitiesResponse,
  SocialProvidersResponse,
  PaymentProvidersResponse,
  VolunteerIdRequest,
  VolunteerSocialResponse,
  VolunteerPaymentOptionResponse,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @GrpcMethod('VolunteerServiceRPC', 'search')
  async search(request: SearchVolunteersRequest): Promise<VolunteersResponse> {
    const volunteers = await this.volunteerService.searchVolunteers(request);

    return { volunteers };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getCities')
  async getCities(request: GetByIdsRequest): Promise<CitiesResponse> {
    const cities = await this.volunteerService.getCities();

    return {
      cities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getActivities')
  async getActivities(request: GetByIdsRequest): Promise<ActivitiesResponse> {
    const activities = await this.volunteerService.getActivities();

    return {
      activities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getSocialProviders')
  async getSocialProviders(
    request: GetByIdsRequest,
  ): Promise<SocialProvidersResponse> {
    const socialProviders = await this.volunteerService.getSocialProviders();

    return {
      socialProviders,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getPaymentProviders')
  async getPaymentProviders(
    request: GetByIdsRequest,
  ): Promise<PaymentProvidersResponse> {
    const paymentProvider = await this.volunteerService.getPaymentProviders();

    return {
      paymentProvider,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerCities')
  async getVolunteerCities(
    request: VolunteerIdRequest,
  ): Promise<CitiesResponse> {
    const cities = await this.volunteerService.getVolunteerCities();

    return {
      cities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerActivities')
  async getVolunteerActivities(
    request: VolunteerIdRequest,
  ): Promise<ActivitiesResponse> {
    const activities = await this.volunteerService.getVolunteerActivities();

    return {
      activities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerSocial')
  async getVolunteerSocial(
    request: VolunteerIdRequest,
  ): Promise<VolunteerSocialResponse> {
    const volunteerSocial = await this.volunteerService.getVolunteerSocial(
      request.volunteerId,
    );

    return {
      volunteerSocial,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerPaymentOptions')
  async getVolunteerPaymentOptions(
    request: VolunteerIdRequest,
  ): Promise<VolunteerPaymentOptionResponse> {
    const paymentOptions =
      await this.volunteerService.getVolunteerPaymentOptions(
        request.volunteerId,
      );

    return {
      paymentOptions,
    };
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
}

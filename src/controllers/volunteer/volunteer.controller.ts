import { Controller } from '@nestjs/common';
import { VolunteerService } from '../../services/volunteer/volunteer.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateVolunteerDto,
  SearchVolunteersDto,
  VolunteersResponseDto,
  GetByIdsDto,
  CitiesDto,
  ActivitiesDto,
  SocialProvidersDto,
  PaymentProvidersDto,
  VolunteerIdRequestDto,
  VolunteerSocialResponseDto,
  VolunteerPaymentOptionResponseDto,
  CreatePaymentOptionDto,
  VolunteerResponseDto,
  UpdatePaymentOptionDto,
  DeletePaymentOptionDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @GrpcMethod('VolunteerServiceRPC', 'search')
  async search(request: SearchVolunteersDto): Promise<VolunteersResponseDto> {
    const volunteers = await this.volunteerService.searchVolunteers(request);

    return { volunteers };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getCities')
  async getCities(request: GetByIdsDto): Promise<CitiesDto> {
    const cities = await this.volunteerService.getCities();

    return {
      cities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getActivities')
  async getActivities(request: GetByIdsDto): Promise<ActivitiesDto> {
    const activities = await this.volunteerService.getActivities();

    return {
      activities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getSocialProviders')
  async getSocialProviders(request: GetByIdsDto): Promise<SocialProvidersDto> {
    const socialProviders = await this.volunteerService.getSocialProviders();

    return {
      socialProviders,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getPaymentProviders')
  async getPaymentProviders(
    request: GetByIdsDto,
  ): Promise<PaymentProvidersDto> {
    const paymentProvider = await this.volunteerService.getPaymentProviders();

    return {
      paymentProvider,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerCities')
  async getVolunteerCities(request: VolunteerIdRequestDto): Promise<CitiesDto> {
    const cities = await this.volunteerService.getVolunteerCities(
      request.volunteerId,
    );

    return {
      cities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerActivities')
  async getVolunteerActivities(
    request: VolunteerIdRequestDto,
  ): Promise<ActivitiesDto> {
    const activities = await this.volunteerService.getVolunteerActivities(
      request.volunteerId,
    );

    return {
      activities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerSocial')
  async getVolunteerSocial(
    request: VolunteerIdRequestDto,
  ): Promise<VolunteerSocialResponseDto> {
    const volunteerSocial = await this.volunteerService.getVolunteerSocial(
      request.volunteerId,
    );

    return {
      volunteerSocial,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerPaymentOptions')
  async getVolunteerPaymentOptions(
    request: VolunteerIdRequestDto,
  ): Promise<VolunteerPaymentOptionResponseDto> {
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
    request: GetByIdsDto,
  ): Promise<VolunteersResponseDto> {
    const volunteers = await this.volunteerService.getVolunteersByIds(
      request.ids,
    );

    return {
      volunteers,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'addPaymentOption')
  async addPaymentOption(
    request: CreatePaymentOptionDto,
  ): Promise<VolunteerResponseDto> {
    return {
      volunteer: null,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'updatePaymentOption')
  async updatePaymentOption(
    request: UpdatePaymentOptionDto,
  ): Promise<VolunteerResponseDto> {
    return {
      volunteer: null,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'deletePaymentOption')
  async deletePaymentOption(
    request: DeletePaymentOptionDto,
  ): Promise<VolunteerResponseDto> {
    return {};
  }

  @GrpcMethod('VolunteerServiceRPC', 'createVolunteer')
  async createVolunteer(
    request: CreateVolunteerDto,
  ): Promise<VolunteerResponseDto> {
    const volunteer = await this.volunteerService.createVolunteer(request);

    return {
      volunteer,
    };
  }
}

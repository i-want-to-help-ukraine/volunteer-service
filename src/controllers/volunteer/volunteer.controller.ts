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
  VolunteerSocialResponseDto,
  VolunteerPaymentOptionResponseDto,
  CreatePaymentOptionDto,
  VolunteerResponseDto,
  UpdatePaymentOptionDto,
  DeletePaymentOptionDto,
  VolunteerIdsRequestDto,
  ContactsResponseDto,
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
    if (request.ids.length > 0) {
      const cities = await this.volunteerService.getCitiesByIds(request.ids);

      return {
        cities,
      };
    }

    const cities = await this.volunteerService.getCities();

    return {
      cities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getActivities')
  async getActivities(request: GetByIdsDto): Promise<ActivitiesDto> {
    if (request.ids.length > 0) {
      const activities = await this.volunteerService.getActivitiesByIds(
        request.ids,
      );

      return {
        activities,
      };
    }

    const activities = await this.volunteerService.getActivities();

    return {
      activities,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getSocialProviders')
  async getSocialProviders(request: GetByIdsDto): Promise<SocialProvidersDto> {
    if (request.ids.length > 0) {
      const socialProviders =
        await this.volunteerService.getSocialProvidersByIds(request.ids);

      return {
        socialProviders,
      };
    }

    const socialProviders = await this.volunteerService.getSocialProviders();

    return {
      socialProviders,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getPaymentProviders')
  async getPaymentProviders(
    request: GetByIdsDto,
  ): Promise<PaymentProvidersDto> {
    if (request.ids.length > 0) {
      const paymentProvider =
        await this.volunteerService.getPaymentProvidersByIds(request.ids);

      return {
        paymentProvider,
      };
    }

    const paymentProvider = await this.volunteerService.getPaymentProviders();

    return {
      paymentProvider,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerSocial')
  async getVolunteerSocial(
    request: VolunteerIdsRequestDto,
  ): Promise<VolunteerSocialResponseDto> {
    const volunteerSocial = await this.volunteerService.getVolunteerSocial(
      request.volunteerIds,
    );

    return {
      volunteerSocial,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerPaymentOptions')
  async getVolunteerPaymentOptions(
    request: VolunteerIdsRequestDto,
  ): Promise<VolunteerPaymentOptionResponseDto> {
    const paymentOptions =
      await this.volunteerService.getVolunteerPaymentOptions(
        request.volunteerIds,
      );

    return {
      paymentOptions,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerContacts')
  async getVolunteerContacts(
    request: VolunteerIdsRequestDto,
  ): Promise<ContactsResponseDto> {
    const contacts = await this.volunteerService.getVolunteerContacts(
      request.volunteerIds,
    );

    return {
      contacts,
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

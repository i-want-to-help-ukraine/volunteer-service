import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VolunteerService } from '../../services/volunteer/volunteer.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  SearchVolunteersDto,
  VolunteersResponseDto,
  GetByIdsDto,
  CitiesDto,
  ContactProvidersDto,
  ActivitiesDto,
  SocialProvidersDto,
  PaymentProvidersDto,
  VolunteerSocialResponseDto,
  VolunteerPaymentOptionResponseDto,
  VolunteerResponseDto,
  VolunteerIdsRequestDto,
  ContactsResponseDto,
  GetByAuthId,
  VolunteerAuthProfileDto,
  CreateProfileDto,
  UpdateProfileDto,
  HideProfileDto,
  SearchVolunteerResponse,
  ChangeVolunteerStatusRequestDto,
  PatchVolunteerRequestDto,
  AddActivityDto,
  AddContactProviderDto,
  AddSocialProviderDto,
  AddPaymentProviderDto,
  ActivityDto,
  PaymentProviderDto,
  ContactProviderDto,
  SocialProviderDto,
  AddReportDto,
  GetReportsDto,
  ReportDto,
} from '@i-want-to-help-ukraine/protobuf/types/volunteer-service';
import { VerificationStatus } from '../../enums/verification-status';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @GrpcMethod('VolunteerServiceRPC', 'search')
  async search(request: SearchVolunteersDto): Promise<SearchVolunteerResponse> {
    const { startCursor } = request;
    const volunteersResult = await this.volunteerService.searchVolunteers(
      request,
    );
    const totalCount = (await this.volunteerService.getVolunteersCount()) || 0;
    const { hasNextPage, volunteers } = volunteersResult;
    // TODO: end cursor should be the last + 1
    const endCursor =
      volunteers.length > 0 ? volunteers[volunteers.length - 1].id : undefined;

    return {
      totalCount,
      volunteers,
      startCursor,
      endCursor,
      hasNextPage,
    };
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

  @GrpcMethod('VolunteerServiceRPC', 'getContactProviders')
  async getContactProviders(
    request: GetByIdsDto,
  ): Promise<ContactProvidersDto> {
    if (request.ids.length > 0) {
      const contactProviders =
        await this.volunteerService.getContactProvidersByIds(request.ids);

      return {
        contactProviders,
      };
    }

    const contactProviders = await this.volunteerService.getContactProviders();

    return {
      contactProviders,
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

  @GrpcMethod('VolunteerServiceRPC', 'getVolunteerAuthProfile')
  async getVolunteerAuthProfile(
    request: GetByAuthId,
  ): Promise<VolunteerAuthProfileDto> {
    const volunteer = await this.volunteerService.getVolunteerByAuthId(
      request.authId,
    );

    if (volunteer === null) {
      throw new BadRequestException();
    }

    return {
      volunteer,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'createProfile')
  async createProfile(
    request: CreateProfileDto,
  ): Promise<VolunteerResponseDto> {
    const foundVolunteer = await this.volunteerService.getVolunteerByAuthId(
      request.authId,
    );

    if (foundVolunteer !== null) {
      throw new BadRequestException();
    }

    const volunteer = await this.volunteerService.createProfile(request);

    if (volunteer === null) {
      throw new InternalServerErrorException();
    }

    return {
      volunteer,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'updateProfile')
  async updateProfile(
    request: UpdateProfileDto,
  ): Promise<VolunteerResponseDto> {
    const foundVolunteer = await this.volunteerService.getVolunteerByAuthId(
      request.authId,
    );

    if (foundVolunteer === null) {
      throw new BadRequestException();
    }

    const volunteer = await this.volunteerService.updateProfile(
      request,
      foundVolunteer,
    );

    if (volunteer === null) {
      throw new InternalServerErrorException();
    }

    return {
      volunteer,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'hideProfile')
  async hideProfile(request: HideProfileDto): Promise<VolunteerResponseDto> {
    const foundVolunteer = await this.volunteerService.getVolunteerByAuthId(
      request.authId,
    );

    if (foundVolunteer === null) {
      throw new BadRequestException();
    }

    const volunteer = await this.volunteerService.hideVolunteerProfile(
      request.authId,
    );

    if (volunteer === null) {
      throw new InternalServerErrorException();
    }

    return {
      volunteer,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'changeVolunteerStatus')
  async changeVolunteerStatus(
    request: ChangeVolunteerStatusRequestDto,
  ): Promise<VolunteerResponseDto> {
    if (
      request.status !== VerificationStatus.verified.toString() &&
      request.status !== VerificationStatus.rejected.toString()
    ) {
      throw new BadRequestException();
    }

    const volunteer = await this.volunteerService.changeVolunteerStatus(
      request.volunteerId,
      request.status as VerificationStatus,
    );

    if (volunteer === null) {
      throw new InternalServerErrorException();
    }

    return {
      volunteer,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'patchVolunteer')
  async patchVolunteer(
    request: PatchVolunteerRequestDto,
  ): Promise<VolunteerResponseDto> {
    const profile = (
      await this.volunteerService.getVolunteersByIds([request.volunteerId])
    )[0];

    if (profile === null) {
      throw new NotFoundException();
    }

    const {
      firstName,
      lastName,
      description,
      avatarUrl,
      organization,
      cityIds,
      activityIds,
      social,
      paymentOptions,
      contacts,
    } = request;

    const updateProfile: UpdateProfileDto = {
      authId: profile.authId,
      firstName,
      lastName,
      description,
      avatarUrl,
      organization,
      cityIds,
      activityIds,
      social,
      paymentOptions,
      contacts,
    };

    const volunteer = await this.volunteerService.updateProfile(
      updateProfile,
      profile,
    );

    if (volunteer === null) {
      throw new InternalServerErrorException();
    }

    return {
      volunteer,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'getRequestedVolunteers')
  async getRequestedVolunteers(): Promise<VolunteersResponseDto> {
    const volunteers = await this.volunteerService.getRequested();

    return {
      volunteers,
    };
  }

  @GrpcMethod('VolunteerServiceRPC', 'addActivity')
  async addActivity(request: AddActivityDto): Promise<ActivityDto | null> {
    return this.volunteerService.addActivity(request);
  }

  @GrpcMethod('VolunteerServiceRPC', 'addPaymentProvider')
  async addPaymentProvider(
    request: AddPaymentProviderDto,
  ): Promise<PaymentProviderDto | null> {
    return this.volunteerService.addPaymentProvider(request);
  }

  @GrpcMethod('VolunteerServiceRPC', 'addContactProvider')
  async addContactProvider(
    request: AddContactProviderDto,
  ): Promise<ContactProviderDto | null> {
    return this.volunteerService.addContactProvider(request);
  }

  @GrpcMethod('VolunteerServiceRPC', 'addSocialProvider')
  async addSocialProvider(
    request: AddSocialProviderDto,
  ): Promise<SocialProviderDto | null> {
    return this.volunteerService.addSocialProvider(request);
  }

  @GrpcMethod('VolunteerServiceRPC', 'addReport')
  addReport(request: AddReportDto): Promise<ReportDto | null> {
    return this.volunteerService.addReport(request);
  }

  @GrpcMethod('VolunteerServiceRPC', 'getReportsByIds')
  getReportsByIds(request: GetReportsDto): Promise<ReportDto[]> {
    return this.volunteerService.getReportsByIds(request.volunteerIds);
  }
}

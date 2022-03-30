import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerService } from './volunteer.service';
import { PrismaService } from '../prisma/prisma.service';
import { MockPrismaService } from '../../../test/mocks/mock-prisma.service';

describe('VolunteerService', () => {
  let service: VolunteerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteerService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VolunteerService>(VolunteerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './services/prisma/prisma.service';
import { VolunteerController } from './controllers/volunteer/volunteer.controller';
import { VolunteerService } from './services/volunteer/volunteer.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [VolunteerController],
  providers: [PrismaService, VolunteerService],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'VolunteerServicePackage',
      protoPath: join(
        process.cwd(),
        './node_modules/@i-want-to-help-ukraine/protobuf/schema/volunteer-service.proto',
      ),
      url: `${configService.get(
        'VOLUNTEER_SERVICE_GRPC_NAME',
      )}:${configService.get('VOLUNTEER_SERVICE_GRPC_PORT')}`,
      loader: {
        arrays: true,
        objects: true,
        json: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('APP_PORT') || 3000);
}
bootstrap();

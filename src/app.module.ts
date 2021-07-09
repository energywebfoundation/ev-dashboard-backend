import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { OcnBridgeModule } from './ocn-bridge/ocn-bridge.module';
import loadConfig from './config/load';
import envValidationSchema from './config/schema';
import { utilities, WinstonModule } from 'nest-winston';
import { PartnersModule } from './partners/partners.module';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: envValidationSchema(),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [loadConfig],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        level: configService.get<string>('log.level'),
        format: winston.format.combine(
          winston.format.timestamp(),
          utilities.format.nestLike('EV Dashboard'),
        ),
        transports: [new winston.transports.Console()],
      }),
      inject: [ConfigService],
    }),
    OcnBridgeModule,
    PartnersModule,
  ],
})
export class AppModule {}

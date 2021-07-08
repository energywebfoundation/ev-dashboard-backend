import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { OcnBridgeModule } from './ocn-bridge/ocn-bridge.module';
import loadConfig from './config/load';
import envValidationSchema from './config/schema';

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
    OcnBridgeModule,
  ],
})
export class AppModule {}

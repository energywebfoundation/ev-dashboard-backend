import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLogger, WinstonModule } from 'nest-winston';
import { OcnBridgeProvider } from './ocn-bridge.providers';
import { Auth } from './schemas/auth.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { Evse } from './schemas/evse.schema';
import { Location } from './schemas/location.schema';
import { Session } from './schemas/session.schema';
import { Token } from './schemas/token.schema';
import { OcnBridgeApi } from './services/ocn-bridge-api';
import { OcnBridgeConfig } from './services/ocn-bridge-config';
import { OcnBridgeDb } from './services/ocn-bridge-db';

@Module({
  imports: [
    WinstonModule,
    WinstonLogger,
    ConfigModule,
    forwardRef(() =>
      TypeOrmModule.forFeature([
        Auth,
        Endpoint,
        Location,
        Evse,
        Token,
        Session,
      ]),
    ),
  ],
  exports: [OcnBridgeProvider],
  providers: [OcnBridgeProvider, OcnBridgeConfig, OcnBridgeDb, OcnBridgeApi],
})
export class OcnBridgeModule {}

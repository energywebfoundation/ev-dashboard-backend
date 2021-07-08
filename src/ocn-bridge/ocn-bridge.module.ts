import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcnBridgeProvider } from './ocn-bridge.providers';
import { Auth } from './schemas/auth.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { OcnBridgeApi } from './services/ocn-bridge-api';
import { OcnBridgeConfig } from './services/ocn-bridge-config';
import { OcnBridgeDb } from './services/ocn-bridge-db';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => TypeOrmModule.forFeature([Auth, Endpoint])),
  ],
  exports: [OcnBridgeProvider],
  providers: [OcnBridgeProvider, OcnBridgeConfig, OcnBridgeDb, OcnBridgeApi],
})
export class OcnBridgeModule {}

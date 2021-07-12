import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLogger, WinstonModule } from 'nest-winston';
import { AssetCacheModule } from 'src/asset-cache/asset-cache.module';
import { PartnersModule } from 'src/partners/partners.module';
import { RegistryModule } from 'src/registry/registry.module';
import { OcnBridgeProvider } from './ocn-bridge.provider';
import { Auth } from './schemas/auth.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { LocationResolverService, TokenResolverService } from './services';
import { OcnBridgeApiService } from './services/api.service';
import { OcnBridgeConfigService } from './services/config.service';
import { OcnBridgeDbService } from './services/db.service';

@Module({
  imports: [
    WinstonModule,
    WinstonLogger,
    ConfigModule,
    TypeOrmModule.forFeature([Auth, Endpoint]),
    PartnersModule,
    RegistryModule,
    AssetCacheModule,
  ],
  exports: [OcnBridgeProvider],
  providers: [
    OcnBridgeProvider,
    OcnBridgeConfigService,
    OcnBridgeDbService,
    OcnBridgeApiService,
    LocationResolverService,
    TokenResolverService,
  ],
})
export class OcnBridgeModule {}

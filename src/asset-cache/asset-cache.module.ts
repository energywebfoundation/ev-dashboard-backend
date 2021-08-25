import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AssetMetadata,
  CacheMetadata,
  Evse,
  Location,
  Session,
  Token,
  Vehicle,
} from './schemas';
import {
  AssetMetadataService,
  CacheMetadataService,
  LocationService,
  SessionService,
  TokenService,
  VehicleService,
} from './services';
import { AssetCacheController } from './asset-cache.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssetMetadata,
      CacheMetadata,
      Location,
      Evse,
      Token,
      Session,
      Vehicle,
    ]),
  ],
  exports: [
    AssetMetadataService,
    CacheMetadataService,
    LocationService,
    TokenService,
    SessionService,
    VehicleService,
  ],
  providers: [
    AssetMetadataService,
    CacheMetadataService,
    LocationService,
    TokenService,
    SessionService,
    VehicleService,
  ],
  controllers: [AssetCacheController],
})
export class AssetCacheModule {}

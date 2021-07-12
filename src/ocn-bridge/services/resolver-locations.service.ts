import { ILocation } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { AssetMetadata } from 'src/asset-cache/schemas';
import {
  AssetMetadataService,
  CacheMetadataService,
  LocationService,
} from 'src/asset-cache/services';
import { RegistryService } from 'src/registry/services/registry.service';
import { Option } from 'src/utils';

@Injectable()
export class LocationResolverService {
  constructor(
    private readonly registryService: RegistryService,
    private readonly locationService: LocationService,
    private readonly assetMetadataService: AssetMetadataService,
    private readonly cacheMetadataService: CacheMetadataService,
  ) {}

  public async resolveAssets(
    location: ILocation,
  ): Promise<Option<Partial<AssetMetadata>[]>> {
    let canCache = true;
    const assets: Partial<AssetMetadata>[] = [];

    for (const evse of location.evses) {
      if (!evse.evse_id) {
        // evse_id is the UID - skip if not set (OCPI optional)
        continue;
      }

      const { some: asset, none: noAsset } =
        await this.registryService.resolveAssetIdentity(evse.evse_id);
      if (noAsset) {
        canCache = canCache && false;
        continue;
      }
      canCache = canCache && true;
      assets.push({ uid: evse.evse_id, ...asset });
    }

    if (!assets.length) {
      return { none: true };
    }

    // for simplicity, all evses must be registered in a given location
    if (canCache) {
      await this.locationService.createOrUpdate(location);
      for (const asset of assets) {
        await this.assetMetadataService.createOrUpdate(asset);
      }
      await this.cacheSyncTimestamp();
      return { some: assets };
    } else {
      return { none: true };
    }
  }

  private async cacheSyncTimestamp() {
    const fixedIDofSingleRecord = 1;
    await this.cacheMetadataService.createOrUpdate({
      _id: fixedIDofSingleRecord,
      lastUpdated: new Date(),
    });
  }
}

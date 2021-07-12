import { IToken } from '@energyweb/ocn-bridge';
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { IAM } from 'iam-client-lib';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AssetMetadata } from 'src/asset-cache/schemas';
import {
  AssetMetadataService,
  CacheMetadataService,
  TokenService,
  VehicleService,
} from 'src/asset-cache/services';
import { VehicleData } from 'src/asset-cache/types';
import { RegistryService } from 'src/registry/services/registry.service';
import { Option, Result } from 'src/utils';

@Injectable()
export class TokenResolverService {
  private context = TokenResolverService.name;
  constructor(
    private readonly registryService: RegistryService,
    private readonly tokenService: TokenService,
    private readonly assetMetadataService: AssetMetadataService,
    private readonly cacheMetadataService: CacheMetadataService,
    private readonly vehicleService: VehicleService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  public async resolveAsset(
    token: IToken,
  ): Promise<Option<Partial<AssetMetadata>>> {
    this.logger.debug(
      `Looking up token ${token.uid} in EV Dashboard Registry`,
      this.context,
    );
    const { some: asset, none } =
      await this.registryService.resolveAssetIdentity(token.uid);
    // asset must exist in EV Registry
    if (none) {
      this.logger.debug(
        `Could not find token ${token.uid} in EV Dashboard Registry`,
        this.context,
      );
      return { none: true };
    }
    this.logger.debug(
      `Creating/Updating token ${token.uid} in cache`,
      this.context,
    );
    await this.tokenService.createOrUpdate(token);
    // save the initial asset (will need it later in case we find a service endpoint)
    const assetEntity = {
      uid: token.uid,
      ...asset,
    };
    await this.assetMetadataService.createOrUpdate(assetEntity);
    await this.cacheSyncTimestamp();
    this.logger.debug(`Token ${token.uid} updated`, this.context);
    return { some: assetEntity };
  }

  public async resolveAssetApiUrl(
    asset: Partial<AssetMetadata>,
    iam: IAM,
  ): Promise<Result<string>> {
    try {
      const didDocument = await iam.getDidDocument({
        did: asset.did,
        includeClaims: true,
      });
      if (!didDocument) {
        throw new Error(`DID Document undefined`);
      }
      this.logger.debug(
        `DID Document service property: ${JSON.stringify(didDocument.service)}`,
        this.context,
      );
      const apiUrl = didDocument.service?.filter(
        (service: any) => service.endpoint != undefined,
      )[0]?.endpoint;
      if (!apiUrl) {
        return {
          err: new Error(
            `No API endpoint configured for MSP device ${asset.did}`,
          ),
        };
      }
      this.logger.debug(
        `API endpoint found for MSP device ${asset.did}: ${apiUrl}`,
      );
      return { ok: apiUrl as string };
    } catch (err) {
      return { err: new Error(err.message) };
    }
  }

  public async resolveAssetMetadata(
    asset: Partial<AssetMetadata>,
    url: string,
    apiToken: string,
  ): Promise<Result> {
    const config = {
      headers: { Authorization: `${apiToken}` },
    };
    try {
      const response = await axios.get(`${url}`, config);
      if (response.status !== 200) {
        throw Error('Vehicle service endpoint data response code not 200');
      }
      const vehicles = response.data.data as VehicleData[];
      const vehicle = vehicles[0];
      const vehicleModel = {
        uid: asset.uid,
        brandName: vehicle.brandName,
        modelName: vehicle.modelName,
        chargePortType: vehicle.chargePort.type,
        chargePortPower: vehicle.chargePort.power,
        fastChargePortType: vehicle.chargePort.type,
        fastChargePortPower: vehicle.chargePort.power,
        batteryCapacity: vehicle.batteryCapacity,
      };
      await this.vehicleService.createOrUpdate(vehicleModel);
      // update asset again with found service endpoint
      await this.assetMetadataService.createOrUpdate({
        ...asset,
        serviceEndpoint: url,
      });
    } catch (err) {
      return { err };
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

import { Controller, Get } from '@nestjs/common';
import { AssetMetadata, Vehicle } from './schemas';
import { AssetMetadataService, TokenService, VehicleService } from './services';

export const defaultVehicle: Vehicle = {
  _id: 0,
  uid: '',
  brandName: '',
  modelName: 'not specified',
  chargePortType: 'not specified',
  chargePortPower: 0,
  fastChargePortType: 'not specified',
  fastChargePortPower: 0,
  batteryCapacity: 0,
};
@Controller('asset-cache')
export class AssetCacheController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly tokenService: TokenService,
    private readonly assetMetadataService: AssetMetadataService,
  ) {}

  @Get('/vehicles')
  public async getAllVehicles(): Promise<(Vehicle & AssetMetadata)[]> {
    const tokens = await this.tokenService.findAll();

    const vehicles = [];

    for (const [, token] of tokens.entries()) {
      const asset = await this.assetMetadataService.findOne(token.uid);
      // "asset" (and did) being set means that the asset has been added to ev-registry
      if (asset?.did) {
        let vehicle: Vehicle;
        vehicle = await this.vehicleService.findOne(token.uid);
        if (!vehicle) {
          vehicle = defaultVehicle;
        }
        vehicles.push({
          ...vehicle,
          ...asset,
        });
      }
    }
    return vehicles;
  }
}

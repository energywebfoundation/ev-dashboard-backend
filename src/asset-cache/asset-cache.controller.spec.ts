import { Test, TestingModule } from '@nestjs/testing';
import { AssetCacheController } from './asset-cache.controller';
import { Vehicle } from './schemas';
import { AssetMetadataService, TokenService, VehicleService } from './services';

// TODO: add more realistic data
const vehicleEntity: Vehicle = {
  _id: 1,
  uid: '',
  brandName: '',
  modelName: '',
  fastChargePortPower: 1,
  fastChargePortType: '',
  chargePortPower: 1,
  chargePortType: '',
  batteryCapacity: 1,
};

describe('AssetCacheController', () => {
  let controller: AssetCacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetCacheController],
      providers: [VehicleService, TokenService, AssetMetadataService],
    }).compile();

    controller = module.get<AssetCacheController>(AssetCacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

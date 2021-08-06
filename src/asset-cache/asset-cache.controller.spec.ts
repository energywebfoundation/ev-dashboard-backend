import { Test, TestingModule } from '@nestjs/testing';
import { AssetCacheController, defaultVehicle } from './asset-cache.controller';
import { AssetMetadata, Token, Vehicle } from './schemas';
import { AssetMetadataService, TokenService, VehicleService } from './services';

// TODO: add more realistic data
const vehicle: Vehicle = {
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

jest.mock('./services/asset-metadata.service.ts');
jest.mock('./services/token.service.ts');
jest.mock('./services/vehicle.service.ts');

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

  it('should return default data if no vehicle', async () => {
    jest.spyOn(TokenService.prototype, 'findAll').mockImplementation(() => {
      const token = new Token();
      return Promise.resolve([token]);
    });

    const assetMetadata = new AssetMetadata();
    assetMetadata.did = 'did:ethr:0xaef17251678Fb2F63184C82f782bD06F9b632109';
    jest
      .spyOn(AssetMetadataService.prototype, 'findOne')
      .mockImplementation(() => {
        return Promise.resolve(assetMetadata);
      });

    jest.spyOn(VehicleService.prototype, 'findOne').mockImplementation(() => {
      return Promise.resolve(undefined);
    });

    const result = [
      {
        ...defaultVehicle,
        ...assetMetadata,
      },
    ];
    expect(await controller.getAllVehicles()).toStrictEqual(result);
  });

  it('should return vehicle data if available', async () => {
    jest.spyOn(TokenService.prototype, 'findAll').mockImplementation(() => {
      const token = new Token();
      return Promise.resolve([token]);
    });

    const assetMetadata = new AssetMetadata();
    assetMetadata.did = 'did:ethr:0xaef17251678Fb2F63184C82f782bD06F9b632109';
    jest
      .spyOn(AssetMetadataService.prototype, 'findOne')
      .mockImplementation(() => {
        return Promise.resolve(assetMetadata);
      });

    jest.spyOn(VehicleService.prototype, 'findOne').mockImplementation(() => {
      return Promise.resolve(vehicle);
    });

    const result = [
      {
        ...vehicle,
        ...assetMetadata,
      },
    ];
    expect(await controller.getAllVehicles()).toStrictEqual(result);
  });

  it('should not add asset if asset DID not set', async () => {
    jest.spyOn(TokenService.prototype, 'findAll').mockImplementation(() => {
      const token = new Token();
      return Promise.resolve([token]);
    });

    const assetMetadata = new AssetMetadata();
    jest
      .spyOn(AssetMetadataService.prototype, 'findOne')
      .mockImplementation(() => {
        return Promise.resolve(assetMetadata);
      });

    const result = [];
    expect(await controller.getAllVehicles()).toStrictEqual(result);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AssetCacheController } from './asset-cache.controller';

describe('AssetCacheController', () => {
  let controller: AssetCacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetCacheController],
    }).compile();

    controller = module.get<AssetCacheController>(AssetCacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

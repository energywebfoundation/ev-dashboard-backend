import { Test, TestingModule } from '@nestjs/testing';
import { OcnBridge } from './ocn-bridge';

describe('OcnBridge', () => {
  let provider: OcnBridge;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcnBridge],
    }).compile();

    provider = module.get<OcnBridge>(OcnBridge);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});

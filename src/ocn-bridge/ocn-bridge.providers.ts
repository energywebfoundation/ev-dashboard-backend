import { FactoryProvider } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OcnBridge } from './services/ocn-bridge';
import { OcnBridgeConfig } from './services/ocn-bridge-config';

enum ProviderToken {
  OCN_BRIDGE = 'OCN_BRIDGE',
}

export const OcnBridgeProvider: FactoryProvider<Promise<OcnBridge>> = {
  provide: ProviderToken.OCN_BRIDGE,
  useFactory: async (config: OcnBridgeConfig, logger: WinstonLogger) =>
    OcnBridge.init(config, logger),
  inject: [OcnBridgeConfig, WINSTON_MODULE_NEST_PROVIDER],
};

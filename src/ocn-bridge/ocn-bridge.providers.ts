import { FactoryProvider } from '@nestjs/common';
import { OcnBridge } from './services/ocn-bridge';
import { OcnBridgeConfig } from './services/ocn-bridge-config';

enum ProviderToken {
  OCN_BRIDGE = 'OCN_BRIDGE',
}

export const OcnBridgeProvider: FactoryProvider<Promise<OcnBridge>> = {
  provide: ProviderToken.OCN_BRIDGE,
  useFactory: async (config: OcnBridgeConfig) => OcnBridge.init(config),
  inject: [OcnBridgeConfig],
};

import { IBridgeConfigurationOptions } from '@energyweb/ocn-bridge';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OcnBridge } from './ocn-bridge';

enum ProviderToken {
  OCN_BRIDGE = 'OCN_BRIDGE',
}

export const OcnBridgeProvider: FactoryProvider<Promise<OcnBridge>> = {
  provide: ProviderToken.OCN_BRIDGE,
  useFactory: async (configService: ConfigService) => {
    return OcnBridge.init(
      configService.get<IBridgeConfigurationOptions>('ocn-bridge'),
    );
  },
  inject: [ConfigService],
};

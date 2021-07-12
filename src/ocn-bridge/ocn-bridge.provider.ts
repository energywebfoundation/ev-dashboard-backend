import { FactoryProvider } from '@nestjs/common';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PartnersService } from 'src/partners/services/partners.service';
import { OcnBridge } from './services/ocn-bridge.service';
import { OcnBridgeConfigService } from './services/config.service';
import { LocationResolverService, TokenResolverService } from './services';

enum ProviderToken {
  OCN_BRIDGE = 'OCN_BRIDGE',
}

export const OcnBridgeProvider: FactoryProvider<Promise<OcnBridge>> = {
  provide: ProviderToken.OCN_BRIDGE,
  useFactory: async (
    config: OcnBridgeConfigService,
    partnersService: PartnersService,
    tokenResolverService: TokenResolverService,
    locationResolverService: LocationResolverService,
    logger: WinstonLogger,
  ) =>
    OcnBridge.init(
      config,
      partnersService,
      tokenResolverService,
      locationResolverService,
      logger,
    ),
  inject: [
    OcnBridgeConfigService,
    PartnersService,
    TokenResolverService,
    LocationResolverService,
    WINSTON_MODULE_NEST_PROVIDER,
  ],
};

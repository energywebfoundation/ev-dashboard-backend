import {
  IBridge,
  IBridgeConfigurationOptions,
  ILocation,
  IToken,
  RequestService,
  startBridge,
} from '@energyweb/ocn-bridge';
import { Server } from 'http';
import { Cron } from '@nestjs/schedule';
import { WinstonLogger } from 'nest-winston';
import { PartnersService } from 'src/partners/services/partners.service';
import { IAM, setCacheClientOptions } from 'iam-client-lib';
import { Partner } from 'src/partners/schemas/partners.schema';
import { Option } from 'src/utils';
import { TokenResolverService } from './index';
import { LocationResolverService } from './resolver-locations.service';

export class OcnBridge {
  private readonly server: Server;
  private readonly requests: RequestService;

  public static async init(
    config: IBridgeConfigurationOptions,
    partnersService: PartnersService,
    tokenResolverService: TokenResolverService,
    locationResolverService: LocationResolverService,
    logger: WinstonLogger,
  ): Promise<OcnBridge> {
    const bridge = await startBridge(config);
    return new OcnBridge(
      bridge,
      partnersService,
      tokenResolverService,
      locationResolverService,
      logger,
    );
  }

  constructor(
    { server, requests }: IBridge,
    private readonly partnersService: PartnersService,
    private readonly tokenResolverService: TokenResolverService,
    private readonly locationResolverService: LocationResolverService,
    private readonly logger: WinstonLogger,
  ) {
    this.server = server;
    this.requests = requests;
  }

  @Cron('* * * * *')
  private async fetchVehicles() {
    const { some: msps, none } = await this.partnersService.getMSPs();
    if (none) {
      this.logger.log('No MSP partners, skipping cron job...', OcnBridge.name);
      return;
    }
    this.logger.log(
      `Fetching vehicles from MSPs (count: ${msps.length})`,
      OcnBridge.name,
    );
    const iam = await this.createIam();
    for (const msp of msps) {
      if (!msp.apiToken) {
        // note: could be a case where a service endpoint doesn't require auth
        this.logger.debug(
          `No API token configured for ${msp.countryCode} ${msp.partyId}. Won't be able to resolve service endpoints.`,
          OcnBridge.name,
        );
      }
      const { some: tokens, none: noTokens } = await this.getTokens(msp);
      if (noTokens) {
        continue;
      }
      for (const token of tokens) {
        const { some: asset, none: noAsset } =
          await this.tokenResolverService.resolveAsset(token);
        if (noAsset) {
          continue;
        }
        if (iam && msp.apiToken) {
          const { ok: apiUrl, err: apiUrlErr } =
            await this.tokenResolverService.resolveAssetApiUrl(asset, iam);
          if (apiUrlErr) {
            this.logger.error(
              `Error retreiving DID Document for ${asset.did}: ${apiUrlErr.message}`,
              apiUrlErr.stack,
              OcnBridge.name,
            );
          }
          if (apiUrl) {
            const { err: metadataErr } =
              await this.tokenResolverService.resolveAssetMetadata(
                asset,
                apiUrl,
                msp.apiToken,
              );
            if (metadataErr) {
              this.logger.error(
                `Unable to retrieve vehicle data for ${token.uid}, MSP: ${msp.countryCode}:${msp.partyId}`,
              );
            }
          }
        }
      }
    }
  }

  @Cron('* * * * *')
  private async fetchEvses() {
    const { some: cpos, none } = await this.partnersService.getCPOs();
    if (none) {
      this.logger.log('No CPO partners, skipping cron job...', OcnBridge.name);
      return;
    }
    this.logger.log(
      `Fetching EVSEs from CPOs (count: ${cpos.length})`,
      OcnBridge.name,
    );
    // const iam = await this.createIam();
    for (const cpo of cpos) {
      if (!cpo.apiToken) {
        // note: could be a case where a service endpoint doesn't require auth
        this.logger.debug(
          `No API token configured for ${cpo.countryCode} ${cpo.partyId}. Won't be able to resolve service endpoints.`,
          OcnBridge.name,
        );
      }
      const { some: locations, none: noLocations } = await this.getLocations(
        cpo,
      );
      if (noLocations) {
        continue;
      }
      for (const location of locations) {
        if (!location.evses) {
          continue;
        }
        await this.locationResolverService.resolveAssets(location);
      }
    }
  }

  private async createIam(): Promise<IAM | undefined> {
    try {
      setCacheClientOptions(73799, {
        url: 'https://identitycache-dev.energyweb.org/',
      });
      // Because iam-client-lib is running on the server, the private key is passed in directly
      const iamClient = new IAM({
        // Arbitrary private key, just used to log-in to cache-server, generated from vanity-eth.tk
        privateKey:
          'f0a36bd28fb7a71f1ceccc53dccfb0742a0ed0bebcf42377739b8be6dd92f8a8', // 0xfee6A6d31a070Ee0414CF48E36379032A2c1b3ce
        rpcUrl: 'https://volta-internal-archive.energyweb.org/',
      });
      await iamClient.initializeConnection();
      return iamClient;
    } catch (err) {
      this.logger.error(
        `Failed to init IAM: ${err.message}`,
        err.stack,
        OcnBridge.name,
      );
    }
  }

  private async getTokens(msp: Partner): Promise<Option<IToken[]>> {
    const tokensResponse = await this.requests.getTokens({
      country_code: msp.countryCode,
      party_id: msp.partyId,
    });
    this.logger.log(
      `OcnBridge received ${
        tokensResponse.data?.length ?? 0
      } MSP tokens from OCPI party ${msp.countryCode} ${msp.partyId}`,
      OcnBridge.name,
    );

    if (tokensResponse?.data) {
      return { some: tokensResponse.data };
    }
    return { none: true };
  }

  private async getLocations(cpo: Partner): Promise<Option<ILocation[]>> {
    try {
      const locationsResponse = await this.requests.getLocations({
        country_code: cpo.countryCode,
        party_id: cpo.partyId,
      });
      this.logger.log(
        `OcnBridge received
        ${locationsResponse.data?.length || 0}
        CPO locations from OCPI party ${cpo.countryCode} ${cpo.partyId}`,
        OcnBridge.name,
      );
      if (locationsResponse?.data) {
        return { some: locationsResponse.data };
      }
      return { none: true };
    } catch (err) {
      this.logger.error(
        `Failed to request locations from ${cpo.countryCode}:${cpo.partyId}: ${err.message}`,
        err.stack,
        OcnBridge.name,
      );
      return { none: true };
    }
  }
}

import { Component, inject } from '@loopback/core';
import {
  IBridge,
  IBridgeConfigurationOptions,
  ModuleImplementation,
  startBridge,
  stopBridge,
  IOcpiParty,
} from '@shareandcharge/ocn-bridge';
import Web3 from 'web3';
import {
  OCN_BRIDGE_API_PROVIDER,
  OCN_BRIDGE_DB_PROVIDER,
  OCN_CONFIG,
  OCPI_LOCATION_REPOSITORY,
  OCPI_TOKEN_REPOSITORY,
  OCN_CACHE_METADATA_REPOSITORY,
  REGISTRY_SERVICE_PROVIDER,
} from '../keys';
import {
  OcnConfig,
  PartialOcnConfig,
} from '../models/interfaces/ocn-config.interface';
import { OcnBridgeApiProvider } from '../providers';
import { OcnBridgeDbProvider } from '../providers/ocn-bridge-db.provider';
import { OcnCacheMetadataRepository, OcpiLocationRepository, OcpiTokenRepository } from '../repositories';
import { OcnCacheMetadata } from '../models';
import { CronJob } from 'cron';
import { RegistryService } from '../services/registry.service';

export class OcnBridgeComponent implements Component {
  private config: IBridgeConfigurationOptions;
  private msps: IOcpiParty[];
  private cpos: IOcpiParty[];
  private bridge: IBridge;
  private address: string;

  constructor(
    @inject(OCN_CONFIG) partialConfig: PartialOcnConfig,
    @inject(OCN_BRIDGE_API_PROVIDER) apiProvider: OcnBridgeApiProvider,
    @inject(OCN_BRIDGE_DB_PROVIDER) dbProvider: OcnBridgeDbProvider,
    @inject(OCPI_TOKEN_REPOSITORY)
    private tokenRepository: OcpiTokenRepository,
    @inject(OCPI_LOCATION_REPOSITORY)
    private locationRepository: OcpiLocationRepository,
    @inject(OCN_CACHE_METADATA_REPOSITORY)
    private cacheMetadataRepository: OcnCacheMetadataRepository,
    @inject(REGISTRY_SERVICE_PROVIDER)
    private registryService: RegistryService
  ) {
    console.info('OcnBridge component is initialized');

    const config = this.getConfig(partialConfig);
    this.msps = config.msps;
    this.cpos = config.cpos;
    this.address = new Web3().eth.accounts.privateKeyToAccount(
      config.identity,
    ).address;

    this.config = {
      port: 8090,
      publicBridgeURL: config.bridgeURL,
      ocnNodeURL: config.nodeURL,
      roles: [
        {
          country_code: 'DE',
          party_id: 'FLX',
          role: 'OTHER',
          business_details: { name: 'FlexHub' },
        },
      ],
      modules: {
        implementation: ModuleImplementation.CUSTOM,
        receiver: ['sessions'],
        sender: [],
      },
      pluggableAPI: apiProvider.value(),
      pluggableDB: dbProvider.value(),
      pluggableRegistry: this.registryService.ocn,
      logger: true,
      signatures: true, // TODO: fix in bridge; enable
      dryRun: false,
      signer: config.identity,
      tokenA: config.tokenA,
    };
  }

  async start() {
    console.info('OcnBridge component is started');
    this.bridge = await startBridge(this.config);
    console.info('OcnBridge listening on port', this.config.port);

    // set the permissions required by flex: to receive forwarded sessions/cdrs
    const hasSetPermissions = await this.registryService.ocn.permissions.getService(
      this.address,
    );
    if (!hasSetPermissions) {
      const name = this.config.roles[0].business_details.name;
      // https://bitbucket.org/shareandcharge/ocn-registry/src/develop/Permissions.md
      // 6 = node forwards sessions receiver requests
      const permissions = [6];
      await this.registryService.ocn.permissions.setService(name, '', permissions);
    }

    // TODO: configurable MSP and CPO (define whom and whitelist them)

    // configure cron task to retrieve device data (tokens and locations)
    // 0 0 * * * = at midnight
    // * * * * * = every minute
    const job = new CronJob('* * * * *', async () => {
      // fetch tokens (device: EV) from MSPs
      for (const msp of this.msps) {
        const tokensResponse = await this.bridge.requests.getTokens(msp);
        console.info(
          'OcnBridge received',
          tokensResponse.data?.length || 0,
          `MSP tokens from OCPI party ${msp.country_code} ${msp.party_id}`,
        );
        for (const token of tokensResponse?.data || []) {
          const asset = await this.registryService.resolveAssetIdentity(token.uid)
          // asset must exist in EV Registry
          if (!asset) {
            continue
          }
          await this.tokenRepository.createOrUpdate(token);
        }
      }

      // fetch locations (device: EVSE) from CPOs
      for (const cpo of this.cpos) {
        const locationsResponse = await this.bridge.requests.getLocations(cpo);
        console.info(
          'OcnBridge received',
          locationsResponse.data?.length || 0,
          `CPO locations from OCPI party ${cpo.country_code} ${cpo.party_id}`,
        );
        for (const location of locationsResponse?.data || []) {
          if (!location.evses) {
            // skip locations without evses
            continue
          }

          let canCache = true
          
          for (const evse of location.evses) {
            if (!evse.evse_id) {
              // evse_id is the UID - skip if not set (OCPI optional)
              continue
            }

            const asset = await this.registryService.resolveAssetIdentity(evse.evse_id)
            if (!asset) {
              canCache = canCache && false
              continue
            }
            canCache = canCache && true
          }
          
          // for simplicity, all evses must be registered in a given location
          if (canCache) {
            await this.locationRepository.createOrUpdate(location);
          }
        }
      }

      // Updating timestamp in cache metadata
      const metadata = new OcnCacheMetadata();
      const fixedIDofSingleRecord = 1;
      metadata.id = fixedIDofSingleRecord;
      metadata.lastUpdated = new Date().toISOString();
      await this.cacheMetadataRepository.createOrUpdate(metadata);
    });
    job.start();
  }

  async stop() {
    await stopBridge(this.bridge);
  }

  exit() {
    console.error('Node must be down. Exiting app.');
    process.exit(1);
  }

  private getConfig(config: PartialOcnConfig): OcnConfig {
    if (!config.identity) {
      throw Error('No "identity" configured in OCN config');
    }
    if (!config.bridgeURL) {
      throw Error('No "bridgeURL" configured in OCN config');
    }
    if (!config.nodeURL) {
      throw Error('No "nodeURL" configured in OCN config');
    }
    if (!config.tokenA) {
      throw Error('No "tokenA" configured in OCN config');
    }
    return config as OcnConfig;
  }
}

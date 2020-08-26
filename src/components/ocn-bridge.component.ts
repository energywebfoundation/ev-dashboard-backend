import {Component, inject} from '@loopback/core';
import {
  DefaultRegistry,
  IBridge,
  IBridgeConfigurationOptions,
  ModuleImplementation,
  startBridge,
  stopBridge,
} from '@shareandcharge/ocn-bridge';
import Web3 from 'web3';
import {
  OcnConfig,
  PartialOcnConfig,
} from '../models/interfaces/ocn-config.interface';
import {OcnBridgeApiProvider} from '../providers';
import {OcnBridgeDbProvider} from '../providers/ocn-bridge-db.provider';
import {
  OCN_CONFIG,
  OCN_BRIDGE_API_PROVIDER,
  OCN_BRIDGE_DB_PROVIDER,
} from '../keys';
import {OcpiTokenRepository, OcpiLocationRepository} from '../repositories';
import {repository} from '@loopback/repository';

export class OcnBridgeComponent implements Component {
  private config: IBridgeConfigurationOptions;
  private registry: DefaultRegistry;
  private bridge: IBridge;
  private address: string;

  constructor(
    @inject(OCN_CONFIG) partialConfig: PartialOcnConfig,
    @inject(OCN_BRIDGE_API_PROVIDER) apiProvider: OcnBridgeApiProvider,
    @inject(OCN_BRIDGE_DB_PROVIDER) dbProvider: OcnBridgeDbProvider,
    @repository(OcpiTokenRepository)
    private tokenRepository: OcpiTokenRepository,
    @repository(OcpiLocationRepository)
    private locationRepository: OcpiLocationRepository,
  ) {
    console.info('OcnBridge component is initialized');

    const config = this.getConfig(partialConfig);
    this.registry = new DefaultRegistry(config.stage, config.identity);
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
          business_details: {name: 'FlexHub'},
        },
      ],
      modules: {
        implementation: ModuleImplementation.CUSTOM,
        receiver: ['sessions'],
        sender: [],
      },
      pluggableAPI: apiProvider.value(),
      pluggableDB: dbProvider.value(),
      pluggableRegistry: this.registry,
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
    const hasSetPermissions = await this.registry.permissions.getService(
      this.address,
    );
    if (!hasSetPermissions) {
      const name = this.config.roles[0].business_details.name;
      // https://bitbucket.org/shareandcharge/ocn-registry/src/develop/Permissions.md
      // 6 = node forwards sessions receiver requests
      const permissions = [6];
      await this.registry.permissions.setService(name, '', permissions);
    }

    // TODO: configure cron task to fetch e.g. once per day (?)
    // TODO: configurable MSP and CPO (define whom and whitelist them)

    // fetch tokens (device: EV) from MSP
    const tokensResponse = await this.bridge.requests.getTokens({
      country_code: 'CH',
      party_id: 'MSP',
    });
    console.info(
      'OcnBridge received',
      tokensResponse.data?.length || 0,
      'tokens',
    );
    for (const token of tokensResponse?.data || []) {
      await this.tokenRepository.createOrUpdate(token);
    }

    // fetch locations (device: EVSE) from CPO
    const locationsResponse = await this.bridge.requests.getLocations({
      country_code: 'CH',
      party_id: 'CPO',
    });
    console.info(
      'OcnBridge received',
      locationsResponse.data?.length || 0,
      'locations',
    );
    for (const location of locationsResponse?.data || []) {
      await this.locationRepository.createOrUpdate(location);
    }
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

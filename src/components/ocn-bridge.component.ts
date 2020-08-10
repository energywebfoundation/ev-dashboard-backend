import {Component, inject} from '@loopback/core';
import {
  startBridge,
  stopBridge,
  IBridgeConfigurationOptions,
  DefaultRegistry,
  IPluggableAPI,
  IPluggableDB,
} from '@shareandcharge/ocn-bridge';
import {ModuleImplementation} from '@shareandcharge/ocn-bridge/dist/models/bridgeConfigurationOptions';
import {Server} from 'http';
import {OcnBridgeApiProvider} from '../providers';
import {OcnBridgeDbProvider} from '../providers/ocn-bridge-db.provider';

export class OcnBridgeComponent implements Component {
  private config: IBridgeConfigurationOptions;
  private bridge: Server;

  constructor(
    @inject('providers.ocnBridgeApiProvider') apiProvider: OcnBridgeApiProvider,
    @inject('providers.ocnBridgeDbProvider') dbProvider: OcnBridgeDbProvider,
  ) {
    console.info('OcnBridge component is initialized');
    this.config = {
      port: 8090,
      publicBridgeURL: 'http://localhost:8090',
      ocnNodeURL: 'http://localhost:8100',
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
        receiver: ['sessions', 'cdrs'],
        sender: [],
      },
      pluggableAPI: apiProvider.value(),
      pluggableDB: dbProvider.value(),
      pluggableRegistry: new DefaultRegistry('local'),
      logger: true,
      signatures: true,
      dryRun: false,
    };
  }

  async start() {
    console.info('OcnBridge component is started');
    this.bridge = await startBridge(this.config);
    console.info('OcnBridge listening on port', this.config.port);
  }

  async stop() {
    await stopBridge(this.bridge);
  }

  exit() {
    console.error('Node must be down. Exiting app.');
    process.exit(1);
  }
}

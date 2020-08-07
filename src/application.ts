import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {MqttBrokerComponent, OcnBridgeComponent} from './components';
import {MqttDataSource, MemoryDataSource} from './datasources';
import { Web3Provider } from './providers/web3.provider';
import { MERKLE_ROOT_SERVICE_PROVIDER, ASSET_ACTIVATION_SERVICE } from './keys';
import { MerkleRootService } from './services';
import { MerkleRootContractProvider } from './providers/merkle-root-contract.provider';
import { BindingScope } from '@loopback/context';
import { AssetActivationService } from './services/asset-activation.service';
import { OcnBridgeApiProvider } from './providers';
import { OcnBridgeDbProvider } from './providers/ocn-bridge-db.provider';
import { 
  OcnConnectionRepository, 
  OcpiEndpointRepository, 
  OcpiSessionRepository, 
  OcpiCdrRepository, 
  OcpiLocationRepository, 
  OcpiTokenRepository 
} from './repositories';

export class EwFlexApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.dataSource(MqttDataSource);
    this.component(MqttBrokerComponent);    
    this.bind(ASSET_ACTIVATION_SERVICE).toClass(AssetActivationService).inScope(BindingScope.SINGLETON);
    this.bind(MERKLE_ROOT_SERVICE_PROVIDER).toClass(MerkleRootService);
    this.serviceProvider(MerkleRootContractProvider);
    this.serviceProvider(Web3Provider);

    // enable connection to OCN
    if (options.ocn) {
      this.dataSource(MemoryDataSource)
      this.bind('providers.ocnBridgeApiProvider').toClass(OcnBridgeApiProvider).inScope(BindingScope.SINGLETON)
      this.bind('providers.ocnBridgeDbProvider').toClass(OcnBridgeDbProvider).inScope(BindingScope.SINGLETON)
      this.repository(OcnConnectionRepository)
      this.repository(OcpiEndpointRepository)
      this.repository(OcpiSessionRepository);
      this.repository(OcpiCdrRepository)
      this.repository(OcpiTokenRepository)
      this.repository(OcpiLocationRepository)
      this.component(OcnBridgeComponent);
    }
    
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      }
    };
  }
}

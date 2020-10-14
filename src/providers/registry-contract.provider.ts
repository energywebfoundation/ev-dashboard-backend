import {getService, juggler} from '@loopback/service-proxy';
import {inject, Provider, bind} from '@loopback/core';
import {RegistryContractDataSource} from '../datasources/registry-contract.datasource';
import {REGISTRY_CONTRACT_PROVIDER} from '../keys';

@bind.provider({tags: {key: REGISTRY_CONTRACT_PROVIDER}})
export class RegistryContractProvider implements Provider<any> {
  constructor(
    @inject('datasources.MerkleRootContract')
    protected dataSource: juggler.DataSource = new RegistryContractDataSource(),
  ) {}

  value(): Promise<any> {
    return getService(this.dataSource);
  }
}

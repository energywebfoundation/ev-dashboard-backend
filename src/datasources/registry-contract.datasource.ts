import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './registry-contract.datasource.config';

export class RegistryContractDataSource extends juggler.DataSource {
  static dataSourceName = 'RegistryContract';

  constructor(
    @inject('datasources.config.registryContract', {optional: true})
    dsConfig: object = config
  ) {
    super(dsConfig);
  }
}

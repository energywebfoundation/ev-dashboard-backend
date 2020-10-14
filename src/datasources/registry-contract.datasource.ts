import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './registry-contract.datasource.config.json';

export class RegistryContractDataSource extends juggler.DataSource {
  static dataSourceName = 'RegistryContract';

  constructor(
    @inject('datasources.config.Contract', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

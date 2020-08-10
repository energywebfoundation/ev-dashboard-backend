import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './merkle-root-contract.datasource.config.json';

export class MerkleRootContractDataSource extends juggler.DataSource {
  static dataSourceName = 'MerkleRootContract';

  constructor(
    @inject('datasources.config.Contract', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

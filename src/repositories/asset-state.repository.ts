import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {AssetState, AssetStateRelations} from '../models';

export class AssetStateRepository extends DefaultCrudRepository<
  AssetState,
  typeof AssetState.prototype.id,
  AssetStateRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(AssetState, dataSource);
  }
}

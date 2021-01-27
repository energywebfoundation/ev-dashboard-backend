import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {AssetType, AssetTypeRelations} from '../models';

export class AssetTypeRepository extends DefaultCrudRepository<
  AssetType,
  typeof AssetType.prototype.id,
  AssetTypeRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(AssetType, dataSource);
  }
}

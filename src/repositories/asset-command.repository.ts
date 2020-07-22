import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MemoryDataSource } from '../datasources';
import { AssetCommand, AssetCommandRelations } from '../models';

export class AssetCommandRepository extends DefaultCrudRepository<
  AssetCommand,
  typeof AssetCommand.prototype.id,
  AssetCommandRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(AssetCommand, dataSource);
  }
}

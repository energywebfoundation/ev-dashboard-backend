import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { MemoryDataSource } from '../datasources/memory.datasource';
import { Asset, AssetRelations, AssetState, AssetType } from '../models';
import { AssetStateRepository } from './asset-state.repository';
import { AssetTypeRepository } from './asset-type.repository';

export class AssetRepository extends DefaultCrudRepository<
  Asset,
  typeof Asset.prototype.id,
  AssetRelations
> {

  public readonly assetType: BelongsToAccessor<AssetType, typeof Asset.prototype.id>;

  public readonly assetState: BelongsToAccessor<AssetState, typeof Asset.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('AssetTypeRepository') protected assetTypeRepositoryGetter: Getter<AssetTypeRepository>, @repository.getter('AssetStateRepository') protected assetStateRepositoryGetter: Getter<AssetStateRepository>,
  ) {
    super(Asset, dataSource);
    this.assetState = this.createBelongsToAccessorFor('assetState', assetStateRepositoryGetter,);
    this.registerInclusionResolver('assetState', this.assetState.inclusionResolver);
    this.assetType = this.createBelongsToAccessorFor('assetType', assetTypeRepositoryGetter,);
    this.registerInclusionResolver('assetType', this.assetType.inclusionResolver);
  }

}

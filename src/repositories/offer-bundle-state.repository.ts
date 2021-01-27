import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {OfferBundleState, OfferBundleStateRelations} from '../models';

export class OfferBundleStateRepository extends DefaultCrudRepository<
  OfferBundleState,
  typeof OfferBundleState.prototype.id,
  OfferBundleStateRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OfferBundleState, dataSource);
  }
}

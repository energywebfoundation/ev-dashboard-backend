import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { OfferState, OfferStateRelations } from '../models';
import { MemoryDataSource } from '../datasources/memory.datasource';

export class OfferStateRepository extends DefaultCrudRepository<
  OfferState,
  typeof OfferState.prototype.id,
  OfferStateRelations
> {

  
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource
  ) {
    super(OfferState, dataSource);
    
  }
}

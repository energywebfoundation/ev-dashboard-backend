import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {ClaimType, ClaimTypeRelations} from '../models';

export class ClaimTypeRepository extends DefaultCrudRepository<
  ClaimType,
  typeof ClaimType.prototype.id,
  ClaimTypeRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(ClaimType, dataSource);
  }
}

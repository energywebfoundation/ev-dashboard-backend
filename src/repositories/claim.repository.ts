import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { MemoryDataSource } from '../datasources/memory.datasource';
import { Claim, ClaimRelations, ClaimType } from '../models';
import { ClaimTypeRepository } from './claim-type.repository';
import { merge } from 'lodash';

export class ClaimRepository extends DefaultCrudRepository<
  Claim,
  typeof Claim.prototype.id,
  ClaimRelations
  > {

  public readonly claimType: BelongsToAccessor<ClaimType, typeof Claim.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('ClaimTypeRepository') protected claimTypeRepositoryGetter: Getter<ClaimTypeRepository>,
  ) {
    super(Claim, dataSource);
    this.claimType = this.createBelongsToAccessorFor('claimType', claimTypeRepositoryGetter,);
    this.registerInclusionResolver('claimType', this.claimType.inclusionResolver);

  }

  
}

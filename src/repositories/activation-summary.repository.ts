import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {ActivationSummary, ActivationSummaryRelations, Offer} from '../models';
import {OfferRepository} from './offer.repository';

export class ActivationSummaryRepository extends DefaultCrudRepository<
  ActivationSummary,
  typeof ActivationSummary.prototype.id,
  ActivationSummaryRelations
> {
  public readonly offer: BelongsToAccessor<
    Offer,
    typeof ActivationSummary.prototype.id
  >;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('OfferRepository')
    protected offerRepositoryGetter: Getter<OfferRepository>,
  ) {
    super(ActivationSummary, dataSource);
    this.offer = this.createBelongsToAccessorFor(
      'offer',
      offerRepositoryGetter,
    );
    this.registerInclusionResolver('offer', this.offer.inclusionResolver);
  }
}

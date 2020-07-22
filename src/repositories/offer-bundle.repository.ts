import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { MemoryDataSource } from '../datasources/memory.datasource';
import { Offer, OfferBundle, OfferBundleRelations, OfferBundleState } from '../models';
import { OfferBundleStateRepository } from './offer-bundle-state.repository';
import { OfferRepository } from './offer.repository';

export class OfferBundleRepository extends DefaultCrudRepository<
  OfferBundle,
  typeof OfferBundle.prototype.id,
  OfferBundleRelations
> {

  public readonly offerBundleState: BelongsToAccessor<OfferBundleState, typeof OfferBundle.prototype.id>;

  public readonly offers: HasManyRepositoryFactory<Offer, typeof OfferBundle.prototype.id>;

  public readonly demandOffer: BelongsToAccessor<Offer, typeof OfferBundle.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('OfferBundleStateRepository') protected offerBundleStateRepositoryGetter: Getter<OfferBundleStateRepository>, @repository.getter('OfferRepository') protected offerRepositoryGetter: Getter<OfferRepository>,
  ) {
    super(OfferBundle, dataSource);
    this.demandOffer = this.createBelongsToAccessorFor('demandOffer', offerRepositoryGetter,);
    this.registerInclusionResolver('demandOffer', this.demandOffer.inclusionResolver);
    this.offers = this.createHasManyRepositoryFactoryFor('offers', offerRepositoryGetter,);
    this.registerInclusionResolver('offers', this.offers.inclusionResolver);
    this.offerBundleState = this.createBelongsToAccessorFor('offerBundleState', offerBundleStateRepositoryGetter,);
    this.registerInclusionResolver('offerBundleState', this.offerBundleState.inclusionResolver);
  }

  
}

import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {merge} from 'lodash';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {
  ActivationSummary,
  Asset,
  DeliveryWindow,
  Offer,
  OfferBundle,
  OfferRelations,
  OfferState,
  Participant,
} from '../models';
import {ActivationSummaryRepository} from './activation-summary.repository';
import {AssetRepository} from './asset.repository';
import {DeliveryWindowRepository} from './delivery-window.repository';
import {OfferBundleRepository} from './offer-bundle.repository';
import {OfferStateRepository} from './offer-state.repository';
import {ParticipantRepository} from './participant.repository';

export class OfferRepository extends DefaultCrudRepository<
  Offer,
  typeof Offer.prototype.id,
  OfferRelations
> {
  public readonly deliveryWindow: BelongsToAccessor<
    DeliveryWindow,
    typeof Offer.prototype.id
  >;

  public readonly offerState: BelongsToAccessor<
    OfferState,
    typeof Offer.prototype.id
  >;

  public readonly asset: BelongsToAccessor<Asset, typeof Offer.prototype.id>;

  public readonly participant: BelongsToAccessor<
    Participant,
    typeof Offer.prototype.id
  >;

  public readonly offerBundle: BelongsToAccessor<
    OfferBundle,
    typeof Offer.prototype.id
  >;

  public readonly activationSummary: HasOneRepositoryFactory<
    ActivationSummary,
    typeof Offer.prototype.id
  >;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
    @repository.getter('DeliveryWindowRepository')
    protected deliveryWindowRepositoryGetter: Getter<DeliveryWindowRepository>,
    @repository.getter('OfferStateRepository')
    protected offerStateRepositoryGetter: Getter<OfferStateRepository>,
    @repository.getter('AssetRepository')
    protected assetRepositoryGetter: Getter<AssetRepository>,
    @repository.getter('ParticipantRepository')
    protected participantRepositoryGetter: Getter<ParticipantRepository>,
    @repository.getter('OfferBundleRepository')
    protected offerBundleRepositoryGetter: Getter<OfferBundleRepository>,
    @repository.getter('ActivationSummaryRepository')
    protected activationSummaryRepositoryGetter: Getter<
      ActivationSummaryRepository
    >,
  ) {
    super(Offer, dataSource);
    this.activationSummary = this.createHasOneRepositoryFactoryFor(
      'activationSummary',
      activationSummaryRepositoryGetter,
    );
    this.registerInclusionResolver(
      'activationSummary',
      this.activationSummary.inclusionResolver,
    );

    this.offerBundle = this.createBelongsToAccessorFor(
      'offerBundle',
      offerBundleRepositoryGetter,
    );
    this.registerInclusionResolver(
      'offerBundle',
      this.offerBundle.inclusionResolver,
    );
    this.participant = this.createBelongsToAccessorFor(
      'owner',
      participantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'participant',
      this.participant.inclusionResolver,
    );
    this.asset = this.createBelongsToAccessorFor(
      'asset',
      assetRepositoryGetter,
    );
    this.registerInclusionResolver('asset', this.asset.inclusionResolver);
    this.offerState = this.createBelongsToAccessorFor(
      'offerState',
      offerStateRepositoryGetter,
    );
    this.registerInclusionResolver(
      'offerState',
      this.offerState.inclusionResolver,
    );
    this.deliveryWindow = this.createBelongsToAccessorFor(
      'deliveryWindow',
      deliveryWindowRepositoryGetter,
    );
    this.registerInclusionResolver(
      'deliveryWindow',
      this.deliveryWindow.inclusionResolver,
    );
  }
}

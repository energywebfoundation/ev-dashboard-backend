import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {OfferBundleState} from './offer-bundle-state.model';
import {Offer, OfferWithRelations} from './offer.model';

@model()
export class OfferBundle extends Entity {
  @property({
    type: 'number',
    id: true,
    index:true
  })
  id: number;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;
  @property({
    type: 'number',
  })
  capacity: number;

  @property({
    type: 'string',
  })
  rootHash?: string;

  @property({
    type: 'string',
    required: false,
    default: ""
  })
  uuid: string;

  @belongsTo(() => OfferBundleState)
  offerBundleStateId: number;

  @hasMany(() => Offer)
  offers: Offer[];

  @belongsTo(() => Offer)
  demandOfferId: number;
  

  constructor(data?: Partial<OfferBundle>) {
    super(data);
  }
}

export interface OfferBundleRelations {
  // describe navigational properties here
  offers? : OfferWithRelations[];
}

export type OfferBundleWithRelations = OfferBundle & OfferBundleRelations;

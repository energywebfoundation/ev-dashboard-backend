import { Entity, model, property, belongsTo, hasOne } from '@loopback/repository';
import { DeliveryWindow } from './delivery-window.model';
import { OfferState, OfferStateRelations } from './offer-state.model';
import { Asset } from './asset.model';
import { Participant } from './participant.model';
import { OfferBundle, OfferBundleRelations, OfferBundleWithRelations } from './offer-bundle.model';
import {ActivationSummary} from './activation-summary.model';

@model({
  name: 'Offer'
})
export class Offer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    index:true
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    required: true,
    index:true
  })
  offerType: number;

  @property({
    type: 'date',
    required: true,
    default: () => new Date()
  })
  created: string;

  @property({
    type: 'string',
    required: false,
  })
  timeslot: string;

  @property({
    type: 'string',
    required: false,
    index:true
  })
  offerId: string;

  @property({
    type: 'number',
    required: true,
  })
  capacity: number;

  @property({
    type: 'number',
    required: true,
    index:true
  })
  price: number;

  // @property({
  //   type: 'number',
  //   required: true,
  //   index:true
  // })
  // offerStateId: number;

  @belongsTo(() => DeliveryWindow)
  deliveryWindowId: number;
  
  
  @belongsTo(() => OfferState,{},{
    index: true
  })
  offerStateId: number;

  @belongsTo(() => Asset,{},{
    index: true
  })
  assetId: number;

  @belongsTo(() => Participant,{},{
    index: true
  })
  ownerId: number;

  @belongsTo(() => OfferBundle,{},{
    index:true
  })
  offerBundleId: number;

  @belongsTo(() => ActivationSummary)
  activationSummaryId: number;

  @hasOne(() => ActivationSummary)
  activationSummary: ActivationSummary;

  constructor(data?: Partial<Offer>) {
    super(data);
  }
}

export interface OfferRelations {
  // describe navigational properties here
}

export type OfferWithRelations = Offer & OfferRelations;

import { Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Offer} from './offer.model';

@model()
export class ActivationSummary extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;
  @property({
    type: 'object',
    required: true,
  })
  summary: object;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;

  @belongsTo(() => Offer,{},{
    index:true
  })
  offerId: number;

  constructor(data?: Partial<ActivationSummary>) {
    super(data);
  }
}

export interface ActivationSummaryRelations {
  // describe navigational properties here
}

export type ActivationSummaryWithRelations = ActivationSummary & ActivationSummaryRelations;

import {Entity, model, property} from '@loopback/repository';

@model()
export class OfferState extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  claimTypeId: number;

  constructor(data?: Partial<OfferState>) {
    super(data);
  }
}

export interface OfferStateRelations {
  // describe navigational properties here
}

export type OfferStateWithRelations = OfferState & OfferStateRelations;

import {Entity, model, property} from '@loopback/repository';

@model()
export class OfferBundleState extends Entity {
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

  constructor(data?: Partial<OfferBundleState>) {
    super(data);
  }
}

export interface OfferBundleStateRelations {
  // describe navigational properties here
}

export type OfferBundleStateWithRelations = OfferBundleState &
  OfferBundleStateRelations;

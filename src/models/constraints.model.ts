import {Entity, model, property} from '@loopback/repository';

@model()
export class Constraints extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  constraints: string;

  @property({
    type: 'date',
    required: true,
  })
  deliveryPeriod: string;

  @property({
    type: 'number',
    required: true,
  })
  limit: number;

  @property({
    type: 'number',
    required: false,
  })
  ownerId: number;

  constructor(data?: Partial<Constraints>) {
    super(data);
  }
}

export interface ConstraintsRelations {
  // describe navigational properties here
}

export type ConstraintsWithRelations = Constraints & ConstraintsRelations;

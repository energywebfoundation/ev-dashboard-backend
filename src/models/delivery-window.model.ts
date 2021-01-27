import {Entity, model, property} from '@loopback/repository';

@model()
export class DeliveryWindow extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  startTime: number;

  @property({
    type: 'number',
    required: true,
  })
  endTime: number;

  constructor(data?: Partial<DeliveryWindow>) {
    super(data);
  }
}

export interface DeliveryWindowRelations {
  // describe navigational properties here
}

export type DeliveryWindowWithRelations = DeliveryWindow &
  DeliveryWindowRelations;

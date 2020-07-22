import { Entity, model, property } from '@loopback/repository';

@model()
export class ParticipantType extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'number',
    required: false,
  })
  claimTypeId: number;


  constructor(data?: Partial<ParticipantType>) {
    super(data);
  }
}

export interface ParticipantTypeRelations {
  // describe navigational properties here
}

export type ParticipantTypeWithRelations = ParticipantType & ParticipantTypeRelations;

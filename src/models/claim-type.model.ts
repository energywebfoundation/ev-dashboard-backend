import { Entity, model, property } from '@loopback/repository';

@model()
export class ClaimType extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: false,
  })
  ownerParticipantTypeId: number;

  @property({
    type: 'number',
    required: false,
  })
  issuerParticipantTypeId: number;

  @property({
    type: 'string',
    required: false,
  })
  requiredSchema: string;


  constructor(data?: Partial<ClaimType>) {
    super(data);
  }
}

export interface ClaimTypeRelations {
  // describe navigational properties here
}

export type ClaimTypeWithRelations = ClaimType & ClaimTypeRelations;

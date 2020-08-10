import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ParticipantType} from './participant-type.model';

@model()
export class Participant extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  //@belongsTo(()=>Claim, keyFrom: onwerId)
  @property({
    type: 'string',
    required: true,
  })
  did: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  organizationType: string;

  @property({
    type: 'string',
    required: true,
  })
  postalAddress: string;

  @property({
    type: 'string',
  })
  meteringAddress?: string;

  @belongsTo(() => ParticipantType)
  participantTypeId: number;

  constructor(data?: Partial<Participant>) {
    super(data);
  }
}

export interface ParticipantRelations {
  // describe navigational properties here
}

export type ParticipantWithRelations = Participant & ParticipantRelations;

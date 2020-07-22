import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ClaimType } from './claim-type.model';

@model()
export class Claim extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;

  @property({
    type: 'string',
    required: false,
    index:true
  })
  ownerId: string;

  @property({
    type: 'string',
    required: false,
  })
  issuerId: string;

  @property({
    type: 'string',
  })
  claimData?: string;

  @property({
    type: 'string',
    required: false,
    default: ""
  })
  claimUrl: string;

  @property({
    type: 'boolean',
    default: false
  })
  isRejected: string;

  @property({
    type: 'boolean',
    default: false
  })
  isServicePoint?: boolean;

  @belongsTo(() => ClaimType)
  claimTypeId: number;

  constructor(data?: Partial<Claim>) {
    super(data);
  }
}

export interface ClaimRelations {
  // describe navigational properties here
}

export type ClaimWithRelations = Claim & ClaimRelations;

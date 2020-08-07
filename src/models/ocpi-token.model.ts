import {Entity, model, property} from '@loopback/repository';

@model()
export class OcpiToken extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  _id?: number;

  @property({
    type: 'string',
    required: true,
  })
  country_code: string;

  @property({
    type: 'string',
    required: true,
  })
  party_id: string;

  @property({
    type: 'string',
    required: true,
  })
  uid: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  contract_id: string;

  @property({
    type: 'string',
  })
  visual_number?: string;

  @property({
    type: 'string',
    required: true,
  })
  issuer: string;

  @property({
    type: 'string',
  })
  group_id?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  valid: boolean;

  @property({
    type: 'string',
    required: true,
  })
  whitelist: string;

  @property({
    type: 'string',
  })
  language?: string;

  @property({
    type: 'string',
  })
  default_profile_type?: string;

  @property({
    type: 'object',
  })
  energy_contract?: IEnergyContract;

  @property({
    type: 'date',
    required: true,
  })
  last_updated: string;


  constructor(data?: Partial<OcpiToken>) {
    super(data);
  }
}

export interface OcpiTokenRelations {
  // describe navigational properties here
}

export type OcpiTokenWithRelations = OcpiToken & OcpiTokenRelations;

export interface IEnergyContract {
  supplier_name: string;
  contract_id?: string;
}

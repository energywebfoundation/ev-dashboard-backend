import {Entity, model, property} from '@loopback/repository';
import {
  ICdrToken,
  IPrice,
  IChargingPeriod,
  ISession,
  authMethod,
  sessionStatus,
} from '@shareandcharge/ocn-bridge/dist/models/ocpi/session';

@model()
export class OcpiSession extends Entity implements ISession {
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
  id: string;

  @property({
    type: 'date',
    required: true,
  })
  start_date_time: string;

  @property({
    type: 'date',
  })
  end_date_time?: string;

  @property({
    type: 'number',
    required: true,
  })
  kwh: number;

  @property({
    type: 'object',
    required: true,
  })
  cdr_token: ICdrToken;

  @property({
    type: 'string',
    required: true,
  })
  auth_method: authMethod;

  @property({
    type: 'string',
  })
  authorization_reference?: string;

  @property({
    type: 'string',
    required: true,
  })
  location_id: string;

  @property({
    type: 'string',
    required: true,
  })
  evse_uid: string;

  @property({
    type: 'string',
    required: true,
  })
  connector_id: string;

  @property({
    type: 'string',
  })
  meter_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  currency: string;
  @property({
    type: 'object',
  })
  total_cost?: IPrice;

  @property({
    type: 'array',
    itemType: 'object',
  })
  charging_periods?: IChargingPeriod[];

  @property({
    type: 'string',
    required: true,
  })
  status: sessionStatus;

  @property({
    type: 'date',
    required: true,
  })
  last_updated: string;

  constructor(data?: Partial<OcpiSession>) {
    super(data);
  }
}

export interface OcpiSessionRelations {
  // describe navigational properties here
}

export type OcpiSessionWithRelations = OcpiSession & OcpiSessionRelations;

// export interface CdrToken {
//   uid: string;
//   type: string;
//   contract_id: string;
// }

// export interface Price {
//   excl_vat: number;
//   incl_vat?: number;
// }

// export interface ChargingPeriod {
//   start_date_time: string;
//   dimensions: CdrDimension[];
//   tariff_id?: string;
// }

// export interface CdrDimension {
//   type: string;
//   volume: number;
// }

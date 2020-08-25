import {Entity, model, property} from '@loopback/repository';
import {
  IGeoLocation,
  IPublishTokenType,
  IAdditionalGeoLocation,
  IEvse,
  IHours,
  IEnergyMix,
  ILocation,
} from '@shareandcharge/ocn-bridge/dist/models/ocpi/locations';
import {
  IDisplayText,
  IBusinessDetails,
  IImage,
} from '@shareandcharge/ocn-bridge/dist/models/ocpi/common';

@model()
export class OcpiLocation extends Entity implements ILocation {
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
    type: 'boolean',
    required: true,
  })
  publish: boolean;

  @property({
    type: 'array',
    itemType: 'object',
  })
  publish_allowed_to?: IPublishTokenType[];

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
  })
  postal_code?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
    required: true,
  })
  country: string;

  @property({
    type: 'object',
    required: true,
  })
  coordinates: IGeoLocation;

  @property({
    type: 'array',
    itemType: 'object',
  })
  related_locations?: IAdditionalGeoLocation[];

  @property({
    type: 'string',
  })
  parking_type?:
    | 'ALONG_MOTORWAY'
    | 'PARKING_GARAGE'
    | 'PARKING_LOT'
    | 'ON_DRIVEWAY'
    | 'ON_STREET'
    | 'UNDERGROUND_GARAGE';

  @property({
    type: 'array',
    itemType: 'object',
  })
  evses?: IEvse[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  directions?: IDisplayText[];

  @property({
    type: 'object',
  })
  operator?: IBusinessDetails;

  @property({
    type: 'object',
  })
  suboperator?: IBusinessDetails;

  @property({
    type: 'object',
  })
  owner?: IBusinessDetails;

  @property({
    type: 'array',
    itemType: 'string',
  })
  facilities?: string[];

  @property({
    type: 'string',
    required: true,
  })
  time_zone: string;

  @property({
    type: 'object',
  })
  opening_times?: IHours;

  @property({
    type: 'boolean',
  })
  charging_when_closed?: boolean;

  @property({
    type: 'array',
    itemType: 'object',
  })
  images?: IImage[];

  @property({
    type: 'object',
  })
  energy_mix?: IEnergyMix;

  @property({
    type: 'date',
    required: true,
  })
  last_updated: string;

  constructor(data?: Partial<OcpiLocation>) {
    super(data);
  }
}

export interface OcpiLocationRelations {
  // describe navigational properties here
}

export type OcpiLocationWithRelations = OcpiLocation & OcpiLocationRelations;

// export interface PublishTokenType {
//   uid?: string;
//   type?: string;
//   visual_number?: string;
//   issuer?: string;
//   group_id?: string;
// }

// export interface AdditionalGeoLocation {
//   latitude: string;
//   longitude: string;
//   name: DisplayText;
// }

// export interface Evse {
//   uid: string;
//   evse_id?: string;
//   status: string;
//   status_schedule?: {
//     period_begin: string
//     period_end?: string
//     status: string
//   }[];
//   capabilities?: string[];
//   connectors: Connector[];
//   floor_level?: string;
//   coordinates?: GeoLocation;
//   physical_reference?: string;
//   directions?: DisplayText[];
//   parking_restrictions?: string[];
//   images?: Image[];
//   last_updated: string;
// }

// export interface Connector {
//   id: string;
//   standard: string;
//   format: string;
//   power_type: string;
//   max_voltage: number;
//   max_amperage: number;
//   max_electric_power?: number;
//   tariff_ids?: string[];
//   terms_and_conditions?: string;
//   last_updated: string;
// }

// export interface Hours {
//   twentyfourseven: boolean;
//   regular_hours?: {
//     weekday: number
//     period_begin: string
//     period_end: string
//   }[];
//   exceptional_openings: {
//     period_begin: string
//     period_end: string
//   }[];
//   exceptional_closings: {
//     period_begin: string
//     period_end: string
//   }[];
// }

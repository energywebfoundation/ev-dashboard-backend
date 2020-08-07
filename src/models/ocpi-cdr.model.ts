import {Entity, model, property, hasMany} from '@loopback/repository';
import { ICdrLocation, ISignedData } from '@shareandcharge/ocn-bridge/dist/models/ocpi/cdrs';
import { ITariff } from '@shareandcharge/ocn-bridge/dist/models/ocpi/tariffs';
import { ICdrToken, IChargingPeriod, IPrice } from '@shareandcharge/ocn-bridge/dist/models/ocpi/session';

@model()
export class OcpiCdr extends Entity {
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
    required: true,
  })
  end_date_time: string;

  @property({
    type: 'string',
  })
  session_id?: string;

  @property({
    type: 'object',
    required: true,
  })
  cdr_token: ICdrToken;

  @property({
    type: 'string',
    required: true,
  })
  auth_method: string;

  @property({
    type: 'string',
  })
  athorization_reference?: string;

  @property({
    type: 'object',
    required: true,
  })
  cdr_location: ICdrLocation;

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
    type: 'array',
    itemType: 'object'
  })
  charging_periods: IChargingPeriod[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  tariffs?: ITariff[];

  @property({
    type: 'object',
  })
  signed_data?: ISignedData;

  @property({
    type: 'object',
    required: true,
  })
  total_cost: IPrice;

  @property({
    type: 'object',
  })
  total_fixed_cost?: IPrice;

  @property({
    type: 'number',
    required: true,
  })
  total_energy: number;

  @property({
    type: 'object',
  })
  total_energy_cost?: IPrice;

  @property({
    type: 'number',
    required: true,
  })
  total_time: number;

  @property({
    type: 'object',
  })
  total_time_cost?: IPrice;

  @property({
    type: 'object',
  })
  total_parking_time?: number;

  @property({
    type: 'object',
  })
  total_parking_cost?: IPrice;

  @property({
    type: 'object',
  })
  total_reservation_cost?: IPrice;

  @property({
    type: 'string',
  })
  remark?: string;

  @property({
    type: 'string',
  })
  invoice_reference_id?: string;

  @property({
    type: 'boolean',
  })
  credit?: boolean;

  @property({
    type: 'string',
  })
  credit_reference_id?: string;

  @property({
    type: 'date',
    required: true,
  })
  last_updated: string;

  constructor(data?: Partial<OcpiCdr>) {
    super(data);
  }
}

export interface OcpiCdrRelations {
  // describe navigational properties here
}

export type OcpiCdrWithRelations = OcpiCdr & OcpiCdrRelations;

// export interface CdrLocation {
//   id: string;
//   name?: string;
//   address: string;
//   city: string;
//   postal_code: string;
//   country: string;
//   coordinates: GeoLocation;
//   evse_uid: string;
//   evse_id: string;
//   connector_id: string;
//   connector_standard: string;
//   connector_format: string;
//   connector_power_type: string;
// }

// export interface GeoLocation {
//   latitude: string;
//   longitude: string;
// }

// export interface SignedData {
//   encoding_method: string;
//   encoding_method_version?: number;
//   public_key?: string;
//   signed_values: SignedValue[];
//   url: string;
// }

// export interface SignedValue {
//   nature: string;
//   plain_data: string;
//   signed_data: string;
// }

// // export interface Tariff {
// //   country_code: string;
// //   party_id: string;
// //   id: string;
// //   currency: string;
// //   type?: string;
// //   tariff_alt_text?: DisplayText;
// //   tariff_alt_url?: string;
// //   min_price?: Price;
// //   max_price?: Price;
// //   elements: TariffElement[];
// //   start_date_time?: string;
// //   end_date_time?: string;
// //   energy_mix?: EnergyMix;
// //   last_updated: string;
// // }

// export interface DisplayText {
//   language: string;
//   text: string;
// }

// export interface TariffElement {
//   price_components: PriceComponent[];
//   restrictions?: TariffRestrictions;
// }

// export interface PriceComponent {
//   type: string;
//   price: number;
//   vat?: number;
//   step_size: number;
// }

// export interface TariffRestrictions {
//   start_time?: string;
//   end_time?: string;
//   start_date?: string;
//   end_date?: string;
//   min_kwh?: string;
//   max_kwh?: string;
//   min_current?: string;
//   max_current?: string;
//   min_power?: string;
//   max_power?: string;
//   min_duration?: string;
//   max_duration?: string;
//   day_of_week?: string[];
//   reservation?: string;
// }

// export interface EnergyMix {
//   is_green_energy: boolean;
//   energy_sources?: EnergySource[];
//   environ_impact?: EnvironImpact[];
//   supplier_name?: string;
//   energy_product_name?: string;
// }

// export interface EnergySource {
//   source: string;
//   percentage: number;
// }

// export interface EnvironImpact {
//   category: string;
//   amount: number;
// }

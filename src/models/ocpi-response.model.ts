import {Model, model, property} from '@loopback/repository';

@model()
export class OcpiResponse<T> extends Model {
  @property({
    type: 'number',
    required: true,
  })
  status_code: number;

  @property({
    type: 'string',
  })
  status_message?: string;

  @property({
    type: 'any',
  })
  data?: T;

  @property({
    type: 'string',
  })
  ocn_signature?: string;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string = new Date().toISOString();

  constructor(data?: Partial<OcpiResponse<T>>) {
    super(data);
  }
}

export interface OcpiResponseRelations {
  // describe navigational properties here
}

export type OcpiResponseWithRelations = OcpiResponse<any> &
  OcpiResponseRelations;

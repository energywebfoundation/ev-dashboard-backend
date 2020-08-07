import {Entity, model, property} from '@loopback/repository';
import { IEndpoint } from '@shareandcharge/ocn-bridge/dist/models/ocpi/common';

@model()
export class OcpiEndpoint extends Entity implements IEndpoint {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  constructor(data?: Partial<OcpiEndpoint>) {
    super(data);
  }
}

export interface OcpiEndpointRelations {
  // describe navigational properties here
}

export type OcpiEndpointWithRelations = OcpiEndpoint & OcpiEndpointRelations;

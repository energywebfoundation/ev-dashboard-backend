import {Entity, model, property} from '@loopback/repository';

@model()
export class OcnConnection extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;
  
  @property({
    type: 'string'
  })
  tokenB: string;

  @property({
    type: 'string'
  })
  tokenC: string;

  constructor(data?: Partial<OcnConnection>) {
    super(data);
  }
}

export interface OcnConnectionRelations {
  // describe navigational properties here
}

export type OcnConnectionWithRelations = OcnConnection & OcnConnectionRelations;

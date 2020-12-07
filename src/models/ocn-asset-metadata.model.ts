import {Entity, model, property} from '@loopback/repository';

@model()
export class OcnAssetMetadata extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  uid: string

  @property({
    type: 'string',
    required: true,
  })
  did: string;

  @property({
    type: 'string',
    required: true
  })
  operatorDid: string;

  constructor(data?: Partial<OcnAssetMetadata>) {
    super(data);
  }
}

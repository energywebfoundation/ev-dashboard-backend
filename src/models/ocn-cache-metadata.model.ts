import {Entity, model, property} from '@loopback/repository';

@model()
export class OcnCacheMetadata extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  lastUpdated: string;

  constructor(data?: Partial<OcnCacheMetadata>) {
    super(data);
  }
}
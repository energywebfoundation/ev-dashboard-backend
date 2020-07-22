import {Entity, model, property} from '@loopback/repository';

@model()
export class AssetType extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<AssetType>) {
    super(data);
  }
}

export interface AssetTypeRelations {
  // describe navigational properties here
}

export type AssetTypeWithRelations = AssetType & AssetTypeRelations;

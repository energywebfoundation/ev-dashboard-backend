import {Entity, model, property} from '@loopback/repository';

@model()
export class AssetState extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  claimTypeId: number;


  constructor(data?: Partial<AssetState>) {
    super(data);
  }
}

export interface AssetStateRelations {
  // describe navigational properties here
}

export type AssetStateWithRelations = AssetState & AssetStateRelations;

import {Entity, model, property, belongsTo} from '@loopback/repository';
import {AssetType} from './asset-type.model';
import {AssetState} from './asset-state.model';

@model()
export class Asset extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    index: true,
  })
  serialNumber: string;

  @property({
    type: 'string',
  })
  equipmentName: string;

  @property({
    type: 'string',
  })
  modelNumber: string;

  @property({
    type: 'string',
  })
  manufacturer: string;

  @property({
    type: 'string',
    index: true,
  })
  ownerId: string;

  @property({
    type: 'number',
  })
  claimId?: number;

  @property({
    type: 'string',
  })
  publicKey?: string;

  @property({
    type: 'string',
    required: false,
    index: true,
  })
  approved?: string;

  @belongsTo(() => AssetType)
  assetTypeId: number;

  @belongsTo(() => AssetState)
  assetStateId: number;

  constructor(data?: Partial<Asset>) {
    super(data);
  }
}

export interface AssetRelations {
  // describe navigational properties here
}

export type AssetWithRelations = Asset & AssetRelations;

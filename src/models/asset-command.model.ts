import {Entity, model, property} from '@loopback/repository';

@model()
export class AssetCommand extends Entity {
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
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  topic: string;


  constructor(data?: Partial<AssetCommand>) {
    super(data);
  }
}

export interface AssetCommandRelations {
  // describe navigational properties here
}

export type AssetCommandWithRelations = AssetCommand & AssetCommandRelations;

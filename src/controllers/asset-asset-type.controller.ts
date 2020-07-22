import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Asset,
  AssetType,
} from '../models';
import {AssetRepository} from '../repositories';

export class AssetAssetTypeController {
  constructor(
    @repository(AssetRepository)
    public assetRepository: AssetRepository,
  ) { }

  @get('/assets/{id}/asset-type', {
    responses: {
      '200': {
        description: 'AssetType belonging to Asset',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AssetType)},
          },
        },
      },
    },
  })
  async getAssetType(
    @param.path.number('id') id: typeof Asset.prototype.id,
  ): Promise<AssetType> {
    return this.assetRepository.assetType(id);
  }
}

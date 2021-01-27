import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Asset, AssetState} from '../models';
import {AssetRepository} from '../repositories';

export class AssetAssetStateController {
  constructor(
    @repository(AssetRepository)
    public assetRepository: AssetRepository,
  ) {}

  @get('/assets/{id}/asset-state', {
    responses: {
      '200': {
        description: 'AssetState belonging to Asset',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(AssetState)},
          },
        },
      },
    },
  })
  async getAssetState(
    @param.path.number('id') id: typeof Asset.prototype.id,
  ): Promise<AssetState> {
    return this.assetRepository.assetState(id);
  }
}

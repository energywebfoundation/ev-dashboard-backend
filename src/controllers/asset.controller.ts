import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Asset} from '../models';
import {AssetRepository} from '../repositories';

export class AssetController {
  constructor(
    @repository(AssetRepository)
    public assetRepository: AssetRepository,
  ) {}

  @post('/assets', {
    responses: {
      '200': {
        description: 'Asset model instance',
        content: {'application/json': {schema: getModelSchemaRef(Asset)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asset, {
            title: 'NewAsset',
            exclude: ['id'],
          }),
        },
      },
    })
    asset: Omit<Asset, 'id'>,
  ): Promise<Asset> {
    return this.assetRepository.create(asset);
  }

  @get('/assets/count', {
    responses: {
      '200': {
        description: 'Asset model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Asset)) where?: Where<Asset>,
  ): Promise<Count> {
    return this.assetRepository.count(where);
  }

  @get('/assets', {
    responses: {
      '200': {
        description: 'Array of Asset model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Asset, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Asset))
    filter?: Filter<Asset>,
  ): Promise<Asset[]> {
    return this.assetRepository.find(filter);
  }

  @patch('/assets', {
    responses: {
      '200': {
        description: 'Asset PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asset, {partial: true}),
        },
      },
    })
    asset: Asset,
    @param.query.object('where', getWhereSchemaFor(Asset)) where?: Where<Asset>,
  ): Promise<Count> {
    return this.assetRepository.updateAll(asset, where);
  }

  @get('/assets/{id}', {
    responses: {
      '200': {
        description: 'Asset model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Asset, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Asset))
    filter?: Filter<Asset>,
  ): Promise<Asset> {
    return this.assetRepository.findById(id, filter);
  }

  @patch('/assets/{id}', {
    responses: {
      '204': {
        description: 'Asset PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asset, {partial: true}),
        },
      },
    })
    asset: Asset,
  ): Promise<void> {
    await this.assetRepository.updateById(id, asset);
  }

  @put('/assets/{id}', {
    responses: {
      '204': {
        description: 'Asset PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() asset: Asset,
  ): Promise<void> {
    await this.assetRepository.replaceById(id, asset);
  }

  @del('/assets/{id}', {
    responses: {
      '204': {
        description: 'Asset DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.assetRepository.deleteById(id);
  }
}

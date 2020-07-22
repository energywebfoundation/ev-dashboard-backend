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
import {AssetCommand} from '../models';
import {AssetCommandRepository} from '../repositories';

export class AssetCommandController {
  constructor(
    @repository(AssetCommandRepository)
    public assetCommandRepository : AssetCommandRepository,
  ) {}

  @post('/asset-commands', {
    responses: {
      '200': {
        description: 'AssetCommand model instance',
        content: {'application/json': {schema: getModelSchemaRef(AssetCommand)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssetCommand, {
            title: 'NewAssetCommand',
            exclude: ['id'],
          }),
        },
      },
    })
    assetCommand: Omit<AssetCommand, 'id'>,
  ): Promise<AssetCommand> {
    return this.assetCommandRepository.create(assetCommand);
  }

  @get('/asset-commands/count', {
    responses: {
      '200': {
        description: 'AssetCommand model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(AssetCommand)) where?: Where<AssetCommand>,
  ): Promise<Count> {
    return this.assetCommandRepository.count(where);
  }

  @get('/asset-commands', {
    responses: {
      '200': {
        description: 'Array of AssetCommand model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(AssetCommand, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(AssetCommand)) filter?: Filter<AssetCommand>,
  ): Promise<AssetCommand[]> {
    return this.assetCommandRepository.find(filter);
  }

  @patch('/asset-commands', {
    responses: {
      '200': {
        description: 'AssetCommand PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssetCommand, {partial: true}),
        },
      },
    })
    assetCommand: AssetCommand,
    @param.query.object('where', getWhereSchemaFor(AssetCommand)) where?: Where<AssetCommand>,
  ): Promise<Count> {
    return this.assetCommandRepository.updateAll(assetCommand, where);
  }

  @get('/asset-commands/{id}', {
    responses: {
      '200': {
        description: 'AssetCommand model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(AssetCommand, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(AssetCommand)) filter?: Filter<AssetCommand>
  ): Promise<AssetCommand> {
    return this.assetCommandRepository.findById(id, filter);
  }

  @patch('/asset-commands/{id}', {
    responses: {
      '204': {
        description: 'AssetCommand PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssetCommand, {partial: true}),
        },
      },
    })
    assetCommand: AssetCommand,
  ): Promise<void> {
    await this.assetCommandRepository.updateById(id, assetCommand);
  }

  @put('/asset-commands/{id}', {
    responses: {
      '204': {
        description: 'AssetCommand PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() assetCommand: AssetCommand,
  ): Promise<void> {
    await this.assetCommandRepository.replaceById(id, assetCommand);
  }

  @del('/asset-commands/{id}', {
    responses: {
      '204': {
        description: 'AssetCommand DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.assetCommandRepository.deleteById(id);
  }
}

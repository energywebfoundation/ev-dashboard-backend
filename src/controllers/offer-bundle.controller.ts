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
import {OfferBundle} from '../models';
import {OfferBundleRepository} from '../repositories';

export class OfferBundleController {
  constructor(
    @repository(OfferBundleRepository)
    public offerBundleRepository: OfferBundleRepository,
  ) {}

  @post('/offer-bundles', {
    responses: {
      '200': {
        description: 'OfferBundle model instance',
        content: {'application/json': {schema: getModelSchemaRef(OfferBundle)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OfferBundle, {
            title: 'NewOfferBundle',
            exclude: ['id'],
          }),
        },
      },
    })
    offerBundle: Omit<OfferBundle, 'id'>,
  ): Promise<OfferBundle> {
    return this.offerBundleRepository.create(offerBundle);
  }

  @get('/offer-bundles/count', {
    responses: {
      '200': {
        description: 'OfferBundle model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(OfferBundle))
    where?: Where<OfferBundle>,
  ): Promise<Count> {
    return this.offerBundleRepository.count(where);
  }

  @get('/offer-bundles', {
    responses: {
      '200': {
        description: 'Array of OfferBundle model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(OfferBundle, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(OfferBundle))
    filter?: Filter<OfferBundle>,
  ): Promise<OfferBundle[]> {
    return this.offerBundleRepository.find(filter);
  }

  @patch('/offer-bundles', {
    responses: {
      '200': {
        description: 'OfferBundle PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OfferBundle, {partial: true}),
        },
      },
    })
    offerBundle: OfferBundle,
    @param.query.object('where', getWhereSchemaFor(OfferBundle))
    where?: Where<OfferBundle>,
  ): Promise<Count> {
    return this.offerBundleRepository.updateAll(offerBundle, where);
  }

  @get('/offer-bundles/{id}', {
    responses: {
      '200': {
        description: 'OfferBundle model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(OfferBundle, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(OfferBundle))
    filter?: Filter<OfferBundle>,
  ): Promise<OfferBundle> {
    return this.offerBundleRepository.findById(id, filter);
  }

  @patch('/offer-bundles/{id}', {
    responses: {
      '204': {
        description: 'OfferBundle PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OfferBundle, {partial: true}),
        },
      },
    })
    offerBundle: OfferBundle,
  ): Promise<void> {
    await this.offerBundleRepository.updateById(id, offerBundle);
  }

  @put('/offer-bundles/{id}', {
    responses: {
      '204': {
        description: 'OfferBundle PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() offerBundle: OfferBundle,
  ): Promise<void> {
    await this.offerBundleRepository.replaceById(id, offerBundle);
  }

  @del('/offer-bundles/{id}', {
    responses: {
      '204': {
        description: 'OfferBundle DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.offerBundleRepository.deleteById(id);
  }
}

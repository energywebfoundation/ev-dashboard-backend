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
import {Constraints} from '../models';
import {ConstraintsRepository} from '../repositories';

export class ConstraintsController {
  constructor(
    @repository(ConstraintsRepository)
    public constraintsRepository: ConstraintsRepository,
  ) {}

  @post('/constraints', {
    responses: {
      '200': {
        description: 'Constraints model instance',
        content: {'application/json': {schema: getModelSchemaRef(Constraints)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Constraints, {
            title: 'NewConstraints',
            exclude: ['id'],
          }),
        },
      },
    })
    constraints: Omit<Constraints, 'id'>,
  ): Promise<Constraints> {
    return this.constraintsRepository.create(constraints);
  }

  @get('/constraints/count', {
    responses: {
      '200': {
        description: 'Constraints model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Constraints))
    where?: Where<Constraints>,
  ): Promise<Count> {
    return this.constraintsRepository.count(where);
  }

  @get('/constraints', {
    responses: {
      '200': {
        description: 'Array of Constraints model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Constraints, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Constraints))
    filter?: Filter<Constraints>,
  ): Promise<Constraints[]> {
    return this.constraintsRepository.find(filter);
  }

  @patch('/constraints', {
    responses: {
      '200': {
        description: 'Constraints PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Constraints, {partial: true}),
        },
      },
    })
    constraints: Constraints,
    @param.query.object('where', getWhereSchemaFor(Constraints))
    where?: Where<Constraints>,
  ): Promise<Count> {
    return this.constraintsRepository.updateAll(constraints, where);
  }

  @get('/constraints/{id}', {
    responses: {
      '200': {
        description: 'Constraints model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Constraints, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Constraints))
    filter?: Filter<Constraints>,
  ): Promise<Constraints> {
    return this.constraintsRepository.findById(id, filter);
  }

  @patch('/constraints/{id}', {
    responses: {
      '204': {
        description: 'Constraints PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Constraints, {partial: true}),
        },
      },
    })
    constraints: Constraints,
  ): Promise<void> {
    await this.constraintsRepository.updateById(id, constraints);
  }

  @put('/constraints/{id}', {
    responses: {
      '204': {
        description: 'Constraints PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() constraints: Constraints,
  ): Promise<void> {
    await this.constraintsRepository.replaceById(id, constraints);
  }

  @del('/constraints/{id}', {
    responses: {
      '204': {
        description: 'Constraints DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.constraintsRepository.deleteById(id);
  }
}

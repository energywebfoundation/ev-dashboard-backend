import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Offer, ActivationSummary} from '../models';
import {OfferRepository} from '../repositories';

export class OfferActivationSummaryController {
  constructor(
    @repository(OfferRepository) protected offerRepository: OfferRepository,
  ) {}

  @get('/offers/{id}/activation-summary', {
    responses: {
      '200': {
        description: 'Offer has one ActivationSummary',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ActivationSummary),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ActivationSummary>,
  ): Promise<ActivationSummary> {
    return this.offerRepository.activationSummary(id).get(filter);
  }

  @post('/offers/{id}/activation-summary', {
    responses: {
      '200': {
        description: 'Offer model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(ActivationSummary)},
        },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Offer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivationSummary, {
            title: 'NewActivationSummaryInOffer',
            exclude: ['id'],
            optional: ['offerId'],
          }),
        },
      },
    })
    activationSummary: Omit<ActivationSummary, 'id'>,
  ): Promise<ActivationSummary> {
    return this.offerRepository.activationSummary(id).create(activationSummary);
  }

  @patch('/offers/{id}/activation-summary', {
    responses: {
      '200': {
        description: 'Offer.ActivationSummary PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ActivationSummary, {partial: true}),
        },
      },
    })
    activationSummary: Partial<ActivationSummary>,
    @param.query.object('where', getWhereSchemaFor(ActivationSummary))
    where?: Where<ActivationSummary>,
  ): Promise<Count> {
    return this.offerRepository
      .activationSummary(id)
      .patch(activationSummary, where);
  }

  @del('/offers/{id}/activation-summary', {
    responses: {
      '200': {
        description: 'Offer.ActivationSummary DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ActivationSummary))
    where?: Where<ActivationSummary>,
  ): Promise<Count> {
    return this.offerRepository.activationSummary(id).delete(where);
  }
}

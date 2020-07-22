import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import { Socket } from 'socket.io';
import { Offer } from '../models';
import { OfferBundleStateRepository, OfferRepository, OfferStateRepository } from '../repositories';

export class OfferController {
  constructor(
    @repository(OfferRepository)
    public offerRepository : OfferRepository,
    @repository(OfferStateRepository)
    public offerStateRepository : OfferStateRepository,
    @repository(OfferBundleStateRepository)
    public offerBundleStateRepository : OfferBundleStateRepository,
    @inject('websocket') private webSocket: Socket,
  ) {}

  @post('/offers', {
    responses: {
      '200': {
        description: 'Offer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Offer)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Offer, {
            title: 'NewOffer',
            exclude: ['id'],
          }),
        },
      },
    })
    offer: Omit<Offer, 'id'>,
  ): Promise<Offer> {
    let _offer = await this.offerRepository.create(offer);
    // await this.redisOfferRepository.create(_offer);    
    return _offer;
  }

  @get('/offers/count', {
    responses: {
      '200': {
        description: 'Offer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Offer)) where?: Where<Offer>,
  ): Promise<Count> {
    return this.offerRepository.count(where);
  }

  @get('/offers', {
    responses: {
      '200': {
        description: 'Array of Offer model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Offer, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Offer)) filter?: Filter<Offer>,
  ): Promise<Offer[]> {
    return this.offerRepository.find(filter);
  }

  @patch('/offers', {
    responses: {
      '200': {
        description: 'Offer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Offer, {partial: true}),
        },
      },
    })
    offer: Offer,
    @param.query.object('where', getWhereSchemaFor(Offer)) where?: Where<Offer>,
  ): Promise<Count> {
    return this.offerRepository.updateAll(offer, where);
  }

  @get('/offers/{id}', {
    responses: {
      '200': {
        description: 'Offer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Offer, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Offer)) filter?: Filter<Offer>
  ): Promise<Offer> {
    return this.offerRepository.findById(id, filter);
  }

  @patch('/offers/{id}', {
    responses: {
      '204': {
        description: 'Offer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Offer, {partial: true}),
        },
      },
    })
    offer: Offer,
  ): Promise<void> {
    await this.offerRepository.updateById(id, offer);
    this.webSocket.emit("offer/bundle/create","update");
  }

  @put('/offers/{id}', {
    responses: {
      '204': {
        description: 'Offer PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() offer: Offer,
  ): Promise<void> {
    await this.offerRepository.replaceById(id, offer);
  }

  @del('/offers/{id}', {
    responses: {
      '204': {
        description: 'Offer DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.offerRepository.deleteById(id);
    this.webSocket.emit("offer/bundle/create","update");
  }
}

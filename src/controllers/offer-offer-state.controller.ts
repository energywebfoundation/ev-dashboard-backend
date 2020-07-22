import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Offer,
  OfferState,
} from '../models';
import {OfferRepository} from '../repositories';

export class OfferOfferStateController {
  constructor(
    @repository(OfferRepository)
    public offerRepository: OfferRepository,
  ) { }

  @get('/offers/{id}/offer-state', {
    responses: {
      '200': {
        description: 'OfferState belonging to Offer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OfferState)},
          },
        },
      },
    },
  })
  async getOfferState(
    @param.path.number('id') id: typeof Offer.prototype.id,
  ): Promise<OfferState> {
    return this.offerRepository.offerState(id);
  }
}

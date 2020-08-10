import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Offer, OfferBundle} from '../models';
import {OfferRepository} from '../repositories';

export class OfferOfferBundleController {
  constructor(
    @repository(OfferRepository)
    public offerRepository: OfferRepository,
  ) {}

  @get('/offers/{id}/offer-bundle', {
    responses: {
      '200': {
        description: 'OfferBundle belonging to Offer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OfferBundle)},
          },
        },
      },
    },
  })
  async getOfferBundle(
    @param.path.number('id') id: typeof Offer.prototype.id,
  ): Promise<OfferBundle> {
    return this.offerRepository.offerBundle(id);
  }
}

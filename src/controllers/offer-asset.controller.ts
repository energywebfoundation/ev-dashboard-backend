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
  Asset,
} from '../models';
import { OfferRepository } from '../repositories';

export class OfferAssetController {
  constructor(
    @repository(OfferRepository)
    public offerRepository: OfferRepository,
  ) { }

  @get('/offers/{id}/asset', {
    responses: {
      '200': {
        description: 'Asset belonging to Offer',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Asset) },
          },
        },
      },
    },
  })
  async getAsset(
    @param.path.number('id') id: typeof Offer.prototype.id,
  ): Promise<Asset> {
    return this.offerRepository.asset(id);
  }
}

import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  OfferBundle,
  OfferBundleState,
} from '../models';
import {OfferBundleRepository} from '../repositories';

export class OfferBundleOfferBundleStateController {
  constructor(
    @repository(OfferBundleRepository)
    public offerBundleRepository: OfferBundleRepository,
  ) { }

  @get('/offer-bundles/{id}/offer-bundle-state', {
    responses: {
      '200': {
        description: 'OfferBundleState belonging to OfferBundle',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OfferBundleState)},
          },
        },
      },
    },
  })
  async getOfferBundleState(
    @param.path.number('id') id: typeof OfferBundle.prototype.id,
  ): Promise<OfferBundleState> {
    return this.offerBundleRepository.offerBundleState(id);
  }
}

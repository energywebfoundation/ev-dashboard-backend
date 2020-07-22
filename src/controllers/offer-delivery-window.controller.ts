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
  DeliveryWindow,
} from '../models';
import {OfferRepository} from '../repositories';

export class OfferDeliveryWindowController {
  constructor(
    @repository(OfferRepository)
    public offerRepository: OfferRepository,
  ) { }

  @get('/offers/{id}/delivery-window', {
    responses: {
      '200': {
        description: 'DeliveryWindow belonging to Offer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DeliveryWindow)},
          },
        },
      },
    },
  })
  async getDeliveryWindow(
    @param.path.number('id') id: typeof Offer.prototype.id,
  ): Promise<DeliveryWindow> {
    return this.offerRepository.deliveryWindow(id);
  }
}

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {ActivationSummary, Offer} from '../models';
import {ActivationSummaryRepository} from '../repositories';

export class ActivationSummaryOfferController {
  constructor(
    @repository(ActivationSummaryRepository)
    public activationSummaryRepository: ActivationSummaryRepository,
  ) {}

  @get('/activation-summaries/{id}/offer', {
    responses: {
      '200': {
        description: 'Offer belonging to ActivationSummary',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Offer)},
          },
        },
      },
    },
  })
  async getOffer(
    @param.path.number('id') id: typeof ActivationSummary.prototype.id,
  ): Promise<Offer> {
    return this.activationSummaryRepository.offer(id);
  }
}

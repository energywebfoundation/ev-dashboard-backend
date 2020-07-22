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
  Participant,
} from '../models';
import {OfferRepository} from '../repositories';

export class OfferParticipantController {
  constructor(
    @repository(OfferRepository)
    public offerRepository: OfferRepository,
  ) { }

  @get('/offers/{id}/participant', {
    responses: {
      '200': {
        description: 'Participant belonging to Offer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Participant)},
          },
        },
      },
    },
  })
  async getParticipant(
    @param.path.number('id') id: typeof Offer.prototype.id,
  ): Promise<Participant> {
    return this.offerRepository.participant(id);
  }
}

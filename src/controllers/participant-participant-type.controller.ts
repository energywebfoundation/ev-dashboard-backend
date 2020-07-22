import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Participant,
  ParticipantType,
} from '../models';
import {ParticipantRepository} from '../repositories';

export class ParticipantParticipantTypeController {
  constructor(
    @repository(ParticipantRepository)
    public participantRepository: ParticipantRepository,
  ) { }

  @get('/participants/{id}/participant-type', {
    responses: {
      '200': {
        description: 'ParticipantType belonging to Participant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ParticipantType)},
          },
        },
      },
    },
  })
  async getParticipantType(
    @param.path.number('id') id: typeof Participant.prototype.id,
  ): Promise<ParticipantType> {
    return this.participantRepository.participantType(id);
  }
}

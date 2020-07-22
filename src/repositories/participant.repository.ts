import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { MemoryDataSource } from '../datasources/memory.datasource';
import { Participant, ParticipantRelations, ParticipantType } from '../models';
import { ParticipantTypeRepository } from './participant-type.repository';

export class ParticipantRepository extends DefaultCrudRepository<
  Participant,
  typeof Participant.prototype.id,
  ParticipantRelations
> {

  public readonly participantType: BelongsToAccessor<ParticipantType, typeof Participant.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('ParticipantTypeRepository') protected participantTypeRepositoryGetter: Getter<ParticipantTypeRepository>,
  ) {
    super(Participant, dataSource);
    this.participantType = this.createBelongsToAccessorFor('participantType', participantTypeRepositoryGetter,);
    this.registerInclusionResolver('participantType', this.participantType.inclusionResolver);
  }
}

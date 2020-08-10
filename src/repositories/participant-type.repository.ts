import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources/memory.datasource';
import {ParticipantType, ParticipantTypeRelations} from '../models';

export class ParticipantTypeRepository extends DefaultCrudRepository<
  ParticipantType,
  typeof ParticipantType.prototype.id,
  ParticipantTypeRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(ParticipantType, dataSource);
  }
}

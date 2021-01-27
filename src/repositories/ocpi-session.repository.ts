import {DefaultCrudRepository} from '@loopback/repository';
import {OcpiSession, OcpiSessionRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcpiSessionRepository extends DefaultCrudRepository<
  OcpiSession,
  typeof OcpiSession.prototype._id,
  OcpiSessionRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OcpiSession, dataSource);
  }
}

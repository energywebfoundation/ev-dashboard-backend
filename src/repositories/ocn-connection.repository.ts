import {DefaultCrudRepository} from '@loopback/repository';
import {OcnConnection, OcnConnectionRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcnConnectionRepository extends DefaultCrudRepository<
  OcnConnection,
  typeof OcnConnection.prototype.id,
  OcnConnectionRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OcnConnection, dataSource);
  }
}

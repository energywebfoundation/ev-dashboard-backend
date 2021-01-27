import {DefaultCrudRepository} from '@loopback/repository';
import {OcpiEndpoint, OcpiEndpointRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcpiEndpointRepository extends DefaultCrudRepository<
  OcpiEndpoint,
  typeof OcpiEndpoint.prototype.id,
  OcpiEndpointRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OcpiEndpoint, dataSource);
  }
}

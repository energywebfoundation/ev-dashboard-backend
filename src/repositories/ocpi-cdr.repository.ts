import {DefaultCrudRepository} from '@loopback/repository';
import {OcpiCdr, OcpiCdrRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcpiCdrRepository extends DefaultCrudRepository<
  OcpiCdr,
  typeof OcpiCdr.prototype._id,
  OcpiCdrRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(OcpiCdr, dataSource);
  }
}

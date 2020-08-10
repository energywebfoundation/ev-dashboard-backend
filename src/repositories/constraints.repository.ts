import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {Constraints, ConstraintsRelations} from '../models';

export class ConstraintsRepository extends DefaultCrudRepository<
  Constraints,
  typeof Constraints.prototype.id,
  ConstraintsRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(Constraints, dataSource);
  }
}

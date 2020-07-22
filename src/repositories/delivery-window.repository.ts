import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { MemoryDataSource } from '../datasources/memory.datasource';
import { DeliveryWindow, DeliveryWindowRelations } from '../models';

export class DeliveryWindowRepository extends DefaultCrudRepository<
  DeliveryWindow,
  typeof DeliveryWindow.prototype.id,
  DeliveryWindowRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(DeliveryWindow, dataSource);
  }
}

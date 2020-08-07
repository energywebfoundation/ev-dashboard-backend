import {DefaultCrudRepository} from '@loopback/repository';
import {OcpiLocation, OcpiLocationRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcpiLocationRepository extends DefaultCrudRepository<
  OcpiLocation,
  typeof OcpiLocation.prototype._id,
  OcpiLocationRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(OcpiLocation, dataSource);
  }

  async createOrUpdate(entity: OcpiLocation) {
    const saved = await this.findOne({
      where: { 
        country_code: entity.country_code,
        party_id: entity.party_id,
        id: entity.id
      }
    });
    if (saved) {
      await this.replaceById(saved._id, entity);
    } else {
      await this.create(entity);
    }
  }

}

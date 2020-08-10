import {DefaultCrudRepository} from '@loopback/repository';
import {OcpiToken, OcpiTokenRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcpiTokenRepository extends DefaultCrudRepository<
  OcpiToken,
  typeof OcpiToken.prototype._id,
  OcpiTokenRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OcpiToken, dataSource);
  }

  async createOrUpdate(entity: OcpiToken) {
    const saved = await this.findOne({
      where: {
        country_code: entity.country_code,
        party_id: entity.party_id,
        uid: entity.uid,
      },
    });
    if (saved) {
      await this.replaceById(saved._id, entity, {});
    } else {
      await this.create(entity);
    }
  }
}

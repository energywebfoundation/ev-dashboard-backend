import {DefaultCrudRepository} from '@loopback/repository';
import {OcnCacheMetadata, OcpiLocation, OcpiLocationRelations} from '../models';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OcnCacheMetadataRepository extends DefaultCrudRepository<
  OcnCacheMetadata,
  typeof OcnCacheMetadata.prototype.id
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OcnCacheMetadata, dataSource);
  }

  async getLatest(): Promise<OcnCacheMetadata | null> {
    return await this.findOne({
      order: ['lastUpdated DESC']
    });
  }

  async createOrUpdate(entity: OcnCacheMetadata) {
    const saved = await this.findOne({
      where: {
        id: entity.id,
      },
    });
    if (saved) {
      await this.replaceById(saved.id, entity);
    } else {
      await this.create(entity);
    }
  }
}

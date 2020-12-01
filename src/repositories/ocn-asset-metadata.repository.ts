import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { OcnAssetMetadata } from '../models';

export class OcnAssetMetadataRepository extends DefaultCrudRepository<
  OcnAssetMetadata,
  typeof OcnAssetMetadata.prototype.id
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(OcnAssetMetadata, dataSource);
  }

  async createOrUpdate(entity: OcnAssetMetadata) {
    const saved = await this.findOne({
      where: {
        uid: entity.uid,
      },
    });
    if (saved) {
      await this.replaceById(saved.id, entity);
    } else {
      await this.create(entity);
    }
  }
}

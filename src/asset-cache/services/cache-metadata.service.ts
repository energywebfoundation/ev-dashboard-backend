import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheMetadata } from '../schemas';

@Injectable()
export class CacheMetadataService {
  constructor(
    @InjectRepository(CacheMetadata)
    private readonly cacheMetadataRepository: Repository<CacheMetadata>,
  ) {}

  public async createOrUpdate(metadata: Partial<CacheMetadata>) {
    const saved = await this.cacheMetadataRepository.findOne({
      _id: metadata._id,
    });
    if (saved) {
      await this.cacheMetadataRepository.update(
        { _id: metadata._id },
        metadata,
      );
    } else {
      await this.cacheMetadataRepository.insert(metadata);
    }
  }
}

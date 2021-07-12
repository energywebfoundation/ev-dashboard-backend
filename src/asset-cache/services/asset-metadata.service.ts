import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetMetadata } from '../schemas';

@Injectable()
export class AssetMetadataService {
  constructor(
    @InjectRepository(AssetMetadata)
    private readonly assetMetadataRepository: Repository<AssetMetadata>,
  ) {}

  public async createOrUpdate(asset: Partial<AssetMetadata>) {
    const saved = await this.assetMetadataRepository.findOne({
      uid: asset.uid,
    });
    if (saved) {
      await this.assetMetadataRepository.update({ _id: saved._id }, asset);
    } else {
      await this.assetMetadataRepository.insert(asset);
    }
  }
}

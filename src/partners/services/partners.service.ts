import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option, Result } from 'src/utils';
import { Repository } from 'typeorm';
import { Partner } from '../schemas/partners.schema';
import { PartnerDto, PartnerType } from '../types';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner) private partnersRepository: Repository<Partner>,
  ) {}

  public async addPartner(partnerDto: PartnerDto): Promise<Result> {
    const { ok: partner, err } = this.validatePartner(partnerDto);
    if (err) {
      return { err };
    }
    const exists = await this.partnersRepository.findOne(partner);
    if (exists) {
      return { err: Error('Partner already exists') };
    }
    try {
      await this.partnersRepository.insert(partner);
      return { ok: true };
    } catch (err) {
      return { err };
    }
  }

  public async getAll(): Promise<Option<Partner[]>> {
    const some = await this.partnersRepository.find();
    if (some) {
      return { some };
    }
    return { none: true };
  }

  public async getMSPs(): Promise<Option<Partner[]>> {
    const some = await this.partnersRepository.find({ type: PartnerType.MSP });
    if (some) {
      return { some };
    }
    return { none: true };
  }

  public async getCPOs(): Promise<Option<Partner[]>> {
    const some = await this.partnersRepository.find({ type: PartnerType.CPO });
    if (some) {
      return { some };
    }
    return { none: true };
  }

  private validatePartner(dto: PartnerDto): Result<Partial<Partner>> {
    if (dto.countryCode.length !== 2) {
      return { err: Error('Country Code length must be 2') };
    }
    if (dto.partyId.length !== 3) {
      return { err: Error('Party ID length must be 3') };
    }
    if (dto.type !== 'msp' && dto.type !== 'cpo') {
      return { err: Error('Type must be one of "msp" or "cpo"') };
    }
    return {
      ok: {
        countryCode: dto.countryCode,
        partyId: dto.partyId,
        type: dto.type === 'msp' ? PartnerType.MSP : PartnerType.CPO,
      },
    };
  }
}

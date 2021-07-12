import { IToken } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../schemas';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly sessionRepository: Repository<Token>,
  ) {}

  public async createOrUpdate(token: IToken) {
    const saved = await this.sessionRepository.findOne({
      country_code: token.country_code,
      party_id: token.party_id,
      uid: token.uid,
    });
    if (saved) {
      await this.sessionRepository.update({ _id: saved._id }, token);
    } else {
      await this.sessionRepository.insert(token);
    }
  }
}

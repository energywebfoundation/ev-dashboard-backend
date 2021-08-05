import { IToken } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../schemas';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  public async createOrUpdate(token: IToken) {
    const saved = await this.tokenRepository.findOne({
      country_code: token.country_code,
      party_id: token.party_id,
      uid: token.uid,
    });
    if (saved) {
      await this.tokenRepository.update({ _id: saved._id }, token);
    } else {
      await this.tokenRepository.insert(token);
    }
  }

  public async findAll() {
    return await this.tokenRepository.find();
  }
}

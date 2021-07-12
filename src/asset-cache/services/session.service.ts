import { ISession } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../schemas';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  public async append(session: ISession) {
    await this.sessionRepository.insert(session);
  }
}

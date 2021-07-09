import { IPluggableAPI, ISession } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../schemas/session.schema';

@Injectable()
export class OcnBridgeApi implements IPluggableAPI {
  public readonly sessions: {
    receiver: { update: (session: ISession) => Promise<void> };
  };

  constructor(
    @InjectRepository(Session)
    sessionsRepository: Repository<Session>,
  ) {
    this.sessions = {
      receiver: {
        update: async (session: ISession) => {
          console.log('received session update', session.id);
          await sessionsRepository.insert(session);
        },
      },
    };
  }
}

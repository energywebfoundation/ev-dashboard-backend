import { IPluggableAPI, ISession } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { SessionService } from 'src/asset-cache/services';

@Injectable()
export class OcnBridgeApiService implements IPluggableAPI {
  public readonly sessions: {
    receiver: { update: (session: ISession) => Promise<void> };
  };

  constructor(sessionService: SessionService) {
    this.sessions = {
      receiver: {
        update: async (session: ISession) => {
          console.log('received session update', session.id);
          await sessionService.append(session);
        },
      },
    };
  }
}

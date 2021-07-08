import { IPluggableAPI, ISession } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OcnBridgeApi implements IPluggableAPI {
  public readonly sessions: {
    receiver: { update: (session: ISession) => Promise<void> };
  };

  constructor() {
    this.sessions = {
      receiver: {
        update: async (session: ISession) => {
          // TODO: store in db (append)
          console.log('received session update', session.id);
        },
      },
    };
  }
}

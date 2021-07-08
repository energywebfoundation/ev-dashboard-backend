import { Injectable, Logger } from '@nestjs/common';
import {
  IBridge,
  IBridgeConfigurationOptions,
  RequestService,
  startBridge,
} from '@energyweb/ocn-bridge';
import { Server } from 'http';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OcnBridge {
  private readonly server: Server;
  private readonly requests: RequestService;
  private readonly logger = new Logger(OcnBridge.name);

  public static async init(
    config: IBridgeConfigurationOptions,
  ): Promise<OcnBridge> {
    const bridge = await startBridge(config);
    return new OcnBridge(bridge);
  }

  constructor({ server, requests }: IBridge) {
    this.server = server;
    this.requests = requests;
  }

  // @Cron('* * * * *')
  // private async fetchVehicles() {
  //   // TODO
  // }

  // @Cron('* * * * *')
  // private async fetchEvses() {
  //   // TODO
  // }
}

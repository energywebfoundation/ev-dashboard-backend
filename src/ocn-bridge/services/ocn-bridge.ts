import {
  IBridge,
  IBridgeConfigurationOptions,
  RequestService,
  startBridge,
} from '@energyweb/ocn-bridge';
import { Server } from 'http';
import { Cron } from '@nestjs/schedule';
import { WinstonLogger } from 'nest-winston';

export class OcnBridge {
  private readonly server: Server;
  private readonly requests: RequestService;

  public static async init(
    config: IBridgeConfigurationOptions,
    logger: WinstonLogger,
  ): Promise<OcnBridge> {
    const bridge = await startBridge(config);
    return new OcnBridge(bridge, logger);
  }

  constructor(
    { server, requests }: IBridge,
    private readonly logger: WinstonLogger,
  ) {
    this.server = server;
    this.requests = requests;
  }

  @Cron('* * * * *')
  private async fetchVehicles() {
    this.logger.log('Fetching vehicles...', OcnBridge.name);
    // TODO
  }

  @Cron('* * * * *')
  private async fetchEvses() {
    this.logger.log('Fetching EVSEs...', OcnBridge.name);
    // TODO
  }
}

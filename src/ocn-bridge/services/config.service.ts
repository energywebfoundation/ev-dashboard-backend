import {
  DefaultRegistry,
  IBridgeConfigurationOptions,
  IModules,
  IPluggableAPI,
  IPluggableDB,
  IRole,
  ModuleImplementation,
} from '@energyweb/ocn-bridge';
import { Wallet } from '@ethersproject/wallet';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserOcnBridgeConfig } from 'src/ocn-bridge/types';
import { RegistryService } from 'src/registry/services/registry.service';
import { parseBool } from 'src/utils';
import { OcnBridgeApiService } from './api.service';
import { OcnBridgeDbService } from './db.service';

@Injectable()
export class OcnBridgeConfigService implements IBridgeConfigurationOptions {
  public readonly port: number;
  public readonly publicBridgeURL: string;
  public readonly ocnNodeURL: string;
  public readonly modules: IModules;
  public readonly roles: IRole[];
  public readonly pluggableAPI: IPluggableAPI;
  public readonly pluggableDB: IPluggableDB;
  public readonly pluggableRegistry: DefaultRegistry;
  public readonly signatures: boolean;
  public readonly dryRun: boolean;
  public readonly logger: boolean;
  public readonly tokenA: string;
  public readonly signer: string;
  public readonly permissions: number[];

  constructor(
    configService: ConfigService,
    api: OcnBridgeApiService,
    db: OcnBridgeDbService,
    registry: RegistryService,
  ) {
    const config = configService.get<UserOcnBridgeConfig>('ocnBridge');
    this.port = parseInt(config.port, 10);
    this.publicBridgeURL = config.url;
    this.ocnNodeURL = config.nodeUrl;
    this.modules = {
      implementation: ModuleImplementation.CUSTOM,
      receiver: ['sessions'],
      sender: [],
    };
    this.roles = config.roles.map((r) => ({
      country_code: r.countryCode,
      party_id: r.partyId,
      role: r.role,
      business_details: r.businessDetails,
    }));
    this.pluggableAPI = api;
    this.pluggableDB = db;
    this.pluggableRegistry = registry.ocn;
    this.signatures = parseBool(config.signatures);
    this.dryRun = parseBool(config.dryRun);
    this.logger = parseBool(config.log);
    this.permissions = config.permissions
      .split(',')
      .map((i) => parseInt(i, 10));
    this.signer = config.signer;
    this.tokenA = config.tokenA;

    this.printConfig();
  }

  private printConfig() {
    console.log(`
      *** OCN BRIDGE CONFIG ***

        url  = ${this.publicBridgeURL} (${this.port})
        addr = ${new Wallet(this.signer).address}

        node = ${this.ocnNodeURL}

        ocpi modules
          receiver = ${this.modules?.receiver}
          sender   = ${this.modules?.sender}

        ocpi credentials
          country code = ${this.roles[0].country_code}
          party id     = ${this.roles[0].party_id}

        settings
          dry run    = ${this.dryRun}
          signatures = ${this.signatures}
          logging    = ${this.logger}

      *************************
    `);
  }
}

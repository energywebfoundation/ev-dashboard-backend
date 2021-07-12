import { DefaultRegistry } from '@energyweb/ocn-bridge';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Option, Result } from 'src/utils';
import { AssetDID, OcpiParty } from '../types';
import abi from '../types/abi';

@Injectable()
export class RegistryService {
  private readonly registry: Contract;
  public readonly ocn: DefaultRegistry;

  constructor(configService: ConfigService) {
    const address = configService.get<string>('registry.address');
    const rpcUrl = configService.get<string>('registry.provider');
    const rpc = new JsonRpcProvider(rpcUrl);
    this.registry = new Contract(address, abi, rpc);

    const network = configService.get<string>('ocnBridge.network');
    const identity = configService.get<string>('ocnBridge.identity');
    this.ocn = new DefaultRegistry(network, identity);
  }

  /**
   * Resolves Eth public key (address) to OCPI credentials (party id, country code)
   * using OCN Registry
   *
   * @param address
   * @returns { partyId, countryCode }
   */
  async resolveOcnIdentity(address: string): Promise<Result<OcpiParty>> {
    const party = await this.ocn.registry.getPartyByAddress(address);
    if (!party) {
      return {
        err: Error(`Could not resolve OCN Identity from address ${address}`),
      };
    }
    return { ok: party };
  }

  /**
   * Resolves OCPI unique identity (token UID, evse ID) to asset's Eth public key (i.e. DID)
   * using EV Registry
   *
   * @param uid
   */
  async resolveAssetIdentity(uid: string): Promise<Option<AssetDID>> {
    const asset = await this.registry.getDeviceFromIdentifier(uid);
    const emptyAddress = '0x'.padEnd(42, '0');
    if (asset.addr === emptyAddress || asset.user === emptyAddress) {
      return { none: true };
    }
    // registry contract assumes erc 1056 for now
    // should be changed in the future so that a user/asset's DID method can be declared
    const method = 'ethr';
    return {
      some: {
        did: `did:${method}:${asset.addr}`,
        operatorDid: `did:${method}:${asset.user}`,
      },
    };
  }
}

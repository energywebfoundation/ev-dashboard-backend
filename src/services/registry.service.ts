import { Contract } from '@ethersproject/contracts';
import {bind, ContextTags, inject} from '@loopback/core';
import { DefaultRegistry, IOcpiParty, IPluggableRegistry } from '@shareandcharge/ocn-bridge';
import {OCN_CONFIG, EV_REGISTRY_CONTRACT_PROVIDER} from '../keys';
import { PartialOcnConfig } from '../models/interfaces';
import { EvRegistryContractProvider } from '../providers/ev-registry-contract.provider';

@bind({tags: {[ContextTags.NAMESPACE]: 'services'}})
export class RegistryService {
  public evRegistry: Contract
  public ocn: DefaultRegistry

  constructor(
    @inject(OCN_CONFIG) protected ocnConfig: PartialOcnConfig,
    @inject(EV_REGISTRY_CONTRACT_PROVIDER) protected provider: EvRegistryContractProvider,
  ) {
    if (!ocnConfig.stage) {
      throw Error('ocn.stage configuration not set')
    }
    this.ocn = new DefaultRegistry(ocnConfig.stage, ocnConfig.identity)
    this.evRegistry = provider.value()
  }

  /**
   * Resolves Eth public key (address) to OCPI credentials (party id, country code)
   * using OCN Registry
   * 
   * @param address 
   */
  async resolveOcnIdentity(address: string): Promise<IOcpiParty> {
    const party = await this.ocn.registry.getPartyByAddress(address);
    if (!party) {
      throw Error(`Could not resolve OCN Identity from address ${address}`)
    }
    return {
      party_id: party.partyId,
      country_code: party.countryCode
    }
  }

  /**
   * Resolves OCPI unique identity (token UID, evse ID) to asset's Eth public key (i.e. DID)
   * using EV Registry
   * 
   * @param uid 
   */
  async resolveAssetIdentity(uid: string): Promise<{ did: string, operatorDid: string } | undefined> {
    const asset = await this.evRegistry.getDeviceFromIdentifier(uid)
    const emptyAddress = '0x'.padEnd(42, '0')
    if (asset.addr === emptyAddress || asset.user === emptyAddress) {
      return
    }
    // registry contract assumes erc 1056 for now
    // should be changed in the future so that a user/asset's DID method can be declared
    const method = 'ethr'
    return {
      did: `did:${method}:${asset.addr}`,
      operatorDid: `did:${method}:${asset.user}`
    }
  }
}

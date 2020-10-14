import {bind, ContextTags, inject} from '@loopback/core';
import { IOcpiParty } from '@shareandcharge/ocn-bridge';
import { Registry as OcnRegistry } from '@shareandcharge/ocn-registry'
import {OCN_CONFIG, REGISTRY_CONTRACT_PROVIDER} from '../keys';
import { PartialOcnConfig } from '../models/interfaces';

@bind({tags: {[ContextTags.NAMESPACE]: 'services'}})
export class RegistryService {
  private registry: any
  private ocnRegistry: OcnRegistry

  constructor(
    @inject(OCN_CONFIG) protected ocnConfig: PartialOcnConfig,
    @inject(REGISTRY_CONTRACT_PROVIDER) protected connector: any,
  ) {
    if (!ocnConfig.stage) {
      throw Error('ocn.stage configuration not set')
    }
    this.ocnRegistry = new OcnRegistry(ocnConfig.stage)
    this.registry = this.connector.contract
  }

  async resolveOcnIdentity(address: string): Promise<IOcpiParty> {
    const party = await this.ocnRegistry.getPartyByAddress(address);
    if (!party) {
      throw Error(`Could not resolve OCN Identity from address ${address}`)
    }
    return {
      party_id: party.partyId,
      country_code: party.countryCode
    }
  }
}

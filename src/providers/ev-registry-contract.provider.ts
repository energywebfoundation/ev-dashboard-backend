import {Provider, bind} from '@loopback/core';
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import {EV_REGISTRY_CONTRACT_PROVIDER} from '../keys';
import evRegistryContractConfig from './ev-registry-contract.config';

@bind.provider({tags: {key: EV_REGISTRY_CONTRACT_PROVIDER}})
export class EvRegistryContractProvider implements Provider<any> {

  value(): Contract {
    const { provider, abi, address } = evRegistryContractConfig
    const rpc = new JsonRpcProvider(provider)
    const contract = new Contract(address, abi, rpc)
    return contract
  }
}

import { getService, juggler } from '@loopback/service-proxy';
import { inject, Provider, bind } from '@loopback/core';
import { MerkleRootContractDataSource } from '../datasources/merkle-root-contract.datasource';
import { MERKLE_ROOT_CONTRACT_PROVIDER } from '../keys';

@bind.provider({ tags: { key: MERKLE_ROOT_CONTRACT_PROVIDER } })
export class MerkleRootContractProvider implements Provider<any> {
	constructor(
		@inject('datasources.MerkleRootContract')
		protected dataSource: juggler.DataSource = new MerkleRootContractDataSource(),
	) { }

	value(): Promise<any> {
		return getService(this.dataSource);
	}
}

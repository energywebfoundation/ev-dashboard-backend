import { inject } from '@loopback/context';
import Web3 from "web3";
import { get } from '@loopback/rest';
import { WEB3_PROVIDER } from '../keys';

export class Web3Controller {
	constructor(
		@inject(WEB3_PROVIDER) private web3: Web3
	) { }

	@get('/blockNumber')
	public async getBlockNumber() {
		return await this.web3.eth.getBlockNumber();
	}
}

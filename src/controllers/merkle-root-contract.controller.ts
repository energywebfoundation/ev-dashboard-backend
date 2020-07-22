import { inject } from '@loopback/context';
import { MERKLE_ROOT_CONTRACT_PROVIDER } from "../keys";
import { get, param, post } from '@loopback/rest';
import * as config from '../datasources/merkle-root-contract.datasource.config.json';

export class MerkleRootContractController {
  constructor(
    @inject(MERKLE_ROOT_CONTRACT_PROVIDER) protected connector: any,
  ) { }


  @get('getMR')
  public getMR(
    @param.query.string('flexRequestID') flexRequestID: string,
    @param.query.string('timestamp') timestamp: string): Promise<any> {
    return this.connector.contract.methods.getMR(flexRequestID, timestamp).call({from: config.options.defaultAccount});

  }

  @post('addMR')
  public addMR(
    @param.query.string('flexRequestID') flexRequestID: string,
    @param.query.number('timestamp') timestamp: number,
    @param.query.string('merkleRoot') merkleRoot: string
  ): Promise<any> {

    return new Promise((resolve, reject) => {
      this.connector.contract.methods
        .addMR(flexRequestID, timestamp, merkleRoot)
        .send({from: config.options.defaultAccount})
        .on('transactionHash', resolve)
        .catch(reject);
    });

  }


}

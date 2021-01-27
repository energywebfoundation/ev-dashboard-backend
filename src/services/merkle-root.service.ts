import {bind, ContextTags, inject} from '@loopback/core';
import {MERKLE_ROOT_CONTRACT_PROVIDER} from '../keys';
const {MerkleTree} = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

@bind({tags: {[ContextTags.NAMESPACE]: 'services'}})
export class MerkleRootService {
  constructor(
    @inject(MERKLE_ROOT_CONTRACT_PROVIDER) protected connector: any,
  ) {}

  async generate(objectArray: string[]) {
    const leaves = objectArray.map(x => SHA256(x));
    const tree = new MerkleTree(leaves, SHA256);
    const root = tree.getRoot().toString('hex');
    return root;
  }
}

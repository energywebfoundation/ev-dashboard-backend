import {juggler} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';

export const testdb: MemoryDataSource = new MemoryDataSource({
  name: 'testdb',
  connector: 'memory',
});

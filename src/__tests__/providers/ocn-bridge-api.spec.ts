import { OcpiSessionRepository } from '../../repositories';
import { testdb } from '../test.datasource';
import { assert } from 'chai';
import { OcnBridgeApiProvider } from '../../providers';
import { expectedSessionData } from './ocn-bridge-api.data';
import { IPluggableAPI } from '@energyweb/ocn-bridge';

describe('OcnBridgeApiProvider', () => {
  let sessionRepo: OcpiSessionRepository;
  let api: IPluggableAPI;

  beforeEach(async () => {
    sessionRepo = new OcpiSessionRepository(testdb);
    api = new OcnBridgeApiProvider(sessionRepo).value();
  });

  afterEach(async () => {
    await sessionRepo.deleteAll();
  });

  it('should provide PluggableAPI', () => {
    assert.hasAllKeys(api, ['sessions']);
    assert.hasAllKeys(api.sessions?.receiver, ['update']);
  });

  it('should create session', async () => {
    await api.sessions?.receiver?.update(expectedSessionData);
    const actual = await sessionRepo.findOne({
      where: { id: expectedSessionData.id },
    });
    assert.equal(actual?.kwh, expectedSessionData.kwh);
  });

  it('should update session', async () => {
    await api.sessions?.receiver?.update(expectedSessionData);
    expectedSessionData.kwh += 0.5;
    await api.sessions?.receiver?.update(expectedSessionData);
    const actual = await sessionRepo.findOne({
      where: { id: expectedSessionData.id },
    });
    assert.equal(actual?.kwh, expectedSessionData.kwh);
  });
});

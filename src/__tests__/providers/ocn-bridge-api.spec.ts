import {OcpiSessionRepository, OcpiCdrRepository} from '../../repositories';
import {testdb} from '../test.datasource';
import {assert} from 'chai';
import {OcnBridgeApiProvider} from '../../providers';
import {expectedSessionData, expectedCdrData} from './ocn-bridge-api.data';
import {IPluggableAPI} from '@shareandcharge/ocn-bridge';

describe('OcnBridgeApiProvider', () => {
  let sessionRepo: OcpiSessionRepository;
  let cdrRepo: OcpiCdrRepository;
  let api: IPluggableAPI;

  beforeEach(async () => {
    sessionRepo = new OcpiSessionRepository(testdb);
    cdrRepo = new OcpiCdrRepository(testdb);
    api = new OcnBridgeApiProvider(sessionRepo, cdrRepo).value();
  });

  afterEach(async () => {
    await sessionRepo.deleteAll();
    await cdrRepo.deleteAll();
  });

  it('should provide PluggableAPI', () => {
    assert.hasAllKeys(api, ['sessions', 'cdrs']);
    assert.hasAllKeys(api.sessions?.receiver, ['update']);
    assert.hasAllKeys(api.cdrs?.receiver, ['get', 'create']);
  });

  it('should create session', async () => {
    await api.sessions?.receiver?.update(expectedSessionData);
    const actual = await sessionRepo.findOne({
      where: {id: expectedSessionData.id},
    });
    assert.equal(actual?.kwh, expectedSessionData.kwh);
  });

  it('should update session', async () => {
    await api.sessions?.receiver?.update(expectedSessionData);
    expectedSessionData.kwh += 0.5;
    await api.sessions?.receiver?.update(expectedSessionData);
    const actual = await sessionRepo.findOne({
      where: {id: expectedSessionData.id},
    });
    assert.equal(actual?.kwh, expectedSessionData.kwh);
  });

  it('should create cdr', async () => {
    await api.cdrs?.receiver?.create(expectedCdrData);
    const actual = await api.cdrs?.receiver?.get(
      expectedCdrData.country_code,
      expectedCdrData.party_id,
      expectedCdrData.id,
    );
    assert.equal(actual?.total_energy, expectedCdrData.total_energy);
  });

  it('should not allow cdr overwrite', async () => {
    await api.cdrs?.receiver?.create(expectedCdrData);
    expectedCdrData.total_energy += 0.5;
    try {
      await api.cdrs?.receiver?.create(expectedCdrData);
      assert.fail('expected statement to throw error');
    } catch (e) {
      assert.equal(e.message, 'Cdr already exists.');
    }
  });

  it('should throw error if no cdr found', async () => {
    try {
      await api.cdrs?.receiver?.get('de', 'abc', 'some-id');
      assert.fail('expected statement to throw error');
    } catch (e) {
      assert.equal(e.message, 'No cdr with id=some-id found.');
    }
  });
});

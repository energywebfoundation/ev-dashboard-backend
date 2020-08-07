import { OcpiSessionRepository, OcpiCdrRepository } from '../../repositories'
import { testdb } from '../test.datasource'
import { assert } from 'chai'
import { OcnBridgeApiProvider } from '../../providers'
import { OcpiSession } from '../../models'

describe('OcnBridgeApiProvider', () => {

    let sessionRepo: OcpiSessionRepository
    let cdrRepo: OcpiCdrRepository
    let provider: OcnBridgeApiProvider

    beforeEach(async () => {
        sessionRepo = new OcpiSessionRepository(testdb)
        cdrRepo = new OcpiCdrRepository(testdb)
        provider = new OcnBridgeApiProvider(sessionRepo, cdrRepo)
    })

    afterEach(async () => {
        await sessionRepo.deleteAll()
        await cdrRepo.deleteAll()
    })

    it('should provide PluggableAPI', () => {
        const api = provider.value()
        assert.hasAllKeys(api, ['sessions', 'cdrs',])
        assert.hasAllKeys(api.sessions?.receiver, ['update'])
        assert.hasAllKeys(api.cdrs?.receiver, ['get', 'create'])
    })

    it('should create session', async () => {
        const api = provider.value()
        const expected = new OcpiSession({
            country_code: 'CA',
            party_id: 'ELC',
            id: '0102030405',
            start_date_time: new Date().toISOString(),
            kwh: 1.2,
            cdr_token: {
                uid: '9999',
                type: 'RFID',
                contract_id: 'CA-ELC-XX99990'
            },
            auth_method: 'WHITELIST',
            location_id: '0145',
            evse_uid: 'XY-777',
            connector_id: '1',
            currency: 'CAD',
            status: 'ACTIVE',
            last_updated: new Date().toISOString()
        })
        await api.sessions?.receiver?.update(expected)

        const actual = await sessionRepo.findOne({where: {id: expected.id}})
        assert.deepEqual(actual?.kwh, expected.kwh)
    })

    it('should update session', async () => {
        throw Error('not implemented!')
    })
    it('should create cdr', async () => {
        throw Error('not implemented')
    })
    it('should not allow cdr overwrite', async () => {
        throw Error('not implemented')
    })

})
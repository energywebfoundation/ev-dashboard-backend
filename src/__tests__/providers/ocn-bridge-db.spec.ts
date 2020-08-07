import { OcnBridgeDbProvider } from "../../providers/ocn-bridge-db.provider"
import { OcnConnectionRepository, OcpiEndpointRepository } from '../../repositories'
import { testdb } from '../test.datasrouce'
import { assert } from 'chai'
import { OcnConnection, OcpiEndpoint } from '../../models'

describe('OcnBridgeDbProvider', () => {

    let connectionRepo: OcnConnectionRepository
    let endpointRepo: OcpiEndpointRepository
    let provider: OcnBridgeDbProvider

    beforeEach(async () => {
        connectionRepo = new OcnConnectionRepository(testdb)
        endpointRepo = new OcpiEndpointRepository(testdb)
        provider = new OcnBridgeDbProvider(connectionRepo, endpointRepo)
    })

    afterEach(async () => {
        await connectionRepo.deleteAll()
        await endpointRepo.deleteAll()
    })

    it('should provide pluggable DB', () => {
        let pluggableDB = provider.value()
        assert.hasAllKeys(pluggableDB, [
            'getTokenB', 
            'setTokenB',
            'getTokenC',
            'setTokenC',
            'getEndpoint',
            'saveEndpoints'
        ])
    })

    it('should set tokens independently', async () => {
        const db = provider.value()
        const expected = new OcnConnection({
            id: 1,
            tokenB: 'my-token-b',
            tokenC: 'my-token-c'
        })

        await db.setTokenB(expected.tokenB)
        await db.setTokenC(expected.tokenC)

        const actualTokenB = await db.getTokenB()
        assert.equal(actualTokenB, expected.tokenB)

        const actualTokenC = await db.getTokenC()
        assert.equal(actualTokenC, expected.tokenC)

        const actualEntity = await connectionRepo.findById(1)
        assert.deepEqual(actualEntity, expected)
    })

    it('should save endpoints', async () => {
        const db = provider.value()
        const expected = [
            new OcpiEndpoint({
                id: undefined,
                identifier: 'sessions',
                role: 'RECEIVER',
                url: 'http://some.example.com/sessions'
            }),
            new OcpiEndpoint({
                id: undefined,
                identifier: 'cdrs',
                role: 'RECEIVER',
                url: 'http://some.example.com/cdrs'
            })
        ]

        await db.saveEndpoints({version: '2.2', endpoints: expected})

        const actualSessions = await db.getEndpoint('sessions', 'RECEIVER')
        assert.equal(actualSessions, expected[0].url)

        const actualCdrs = await db.getEndpoint('cdrs', 'RECEIVER')
        assert.equal(actualCdrs, expected[1].url)

        const actualEntities = await endpointRepo.find({fields: {id: false}})
        assert.deepEqual(actualEntities, expected)
    })

})
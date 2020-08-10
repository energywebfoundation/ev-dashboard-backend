import { OcpiSession, OcpiCdr } from '../../models';

export const expectedSessionData = new OcpiSession({
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

export const expectedCdrData = new OcpiCdr({
    country_code: 'CA',
    party_id: 'ELC',
    id: '8888',
    start_date_time: new Date().toISOString(),
    end_date_time: new Date().toISOString(),
    session_id: '0102030405',
    cdr_token: {
        uid: '9999',
        type: 'RFID',
        contract_id: 'CA-ELC-XX99990'
    },
    auth_method: 'WHITELIST',
    cdr_location: {
        id: '0145',
        address: 'Somewhere Way 1',
        city: 'Vancouver',
        postal_code: '00000',
        country: 'CAN',
        coordinates: {
            latitude: '0.000',
            longitude: '0.000'
        },
        evse_id: 'DE-ELC-0145XY',
        evse_uid: 'XX-777',
        connector_id: '1',
        connector_format: 'SOCKET',
        connector_power_type: 'AC_3_PHASE',
        connector_standard: 'CHADEMO'
    },
    currency: 'CAD',
    charging_periods: [{
        start_date_time: new Date().toISOString(),
        dimensions: [{
            volume: 1000,
            type: 'ENERGY'
        }]
    }],
    total_cost: {
        excl_vat: 1.5
    },
    total_energy: 1000,
    total_time: 0,
    last_updated: new Date().toISOString()
})

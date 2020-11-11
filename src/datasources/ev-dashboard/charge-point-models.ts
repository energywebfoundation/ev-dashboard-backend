export interface AssetIdentity {
    /** identifier: VIN, EVSE ID */
    id: string;
    /** Address used in DID */
    publicKey: string;
    /** Location of DID Document's off-chain data */
    serviceEndpoint: string;
}

export interface ChargePointModel {
    /** chargeRate, in kW. */
    chargeRate: number
    serialNumber: string
    description: string
}

export const chargePointModels: ChargePointModel[] = [
    // Retrieved from "https://openchargemap.org/site/poi/details/38443"
    {
        chargeRate: 11,
        serialNumber: '0014',
        description: 'Wallbox'
    },
]
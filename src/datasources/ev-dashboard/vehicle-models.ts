export interface VehicleModel {
    brandName: string,
    modelName: string,
    /** AC charge port of vehicle. */
    chargePort: ChargePort,
    /** DC charge port of vehicle. Null if vehicle does not have. */
    fastChargePort: ChargePort | null
    /** Max battery capacity, in kWh. */
    batteryCapacity: number
}

interface ChargePort {
    type: ChargePortType,
    /** Power that vehicle can accept when using port, in kW. */
    power: number
}

declare type ChargePortType = "Type2" | "CCS"

export const vehicleModels: VehicleModel[] = [
    // Retrieved from "https://ev-database.org/car/1135/Mercedes-EQC-400-4MATIC"
    {
        brandName: "Mercedes-Benz",
        modelName: "EQC 400 4MATIC",
        chargePort: {
            type: "Type2",
            power: 7.4
        },
        fastChargePort: {
            type: "CCS",
            power: 112
        },
        batteryCapacity: 85
    },
    // Retrieved from "https://ev-database.org/car/1230/Smart-EQ-fortwo-coupe"
    {
        brandName: "Smart",
        modelName: "EQ fortwo coupe",
        chargePort: {
            type: "Type2",
            power: 4.6
        },
        fastChargePort: null,
        batteryCapacity: 17.6
    },
]
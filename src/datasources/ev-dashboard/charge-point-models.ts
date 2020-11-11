export interface ChargePointModel {
    /** chargeRate, in kW. */
    chargeRate: number
}

export const chargePointModels: ChargePointModel[] = [
    // Retrieved from "https://openchargemap.org/site/poi/details/38443"
    {
        chargeRate: 11
    },
]
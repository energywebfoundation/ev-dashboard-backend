export type VehicleData = {
  brandName: string;
  modelName: string;
  /** AC charge port of vehicle. */
  chargePort: ChargePort;
  /** DC charge port of vehicle. Null if vehicle does not have. */
  fastChargePort?: ChargePort;
  /** Max battery capacity, in kWh. */
  batteryCapacity: number;
};

export type ChargePort = {
  type: string;
  /** Power that vehicle can accept when using port, in kW. */
  power: number;
};

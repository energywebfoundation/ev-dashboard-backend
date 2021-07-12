export enum PartnerType {
  MSP = 'msp',
  CPO = 'cpo',
}

export type PartnerDto = {
  countryCode: string;
  partyId: string;
  type: string;
};

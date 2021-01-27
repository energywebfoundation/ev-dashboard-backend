import { IOcpiParty } from '@energyweb/ocn-bridge';

export interface PartialOcnConfig {
  enabled: boolean;
  stage?: string;
  bridgeURL?: string;
  identity?: string;
  nodeURL?: string;
  tokenA?: string;
  msps?: IOcpiParty[];
  cpos?: IOcpiParty[];
}

export interface OcnConfig {
  stage: string;
  bridgeURL: string;
  identity: string;
  nodeURL: string;
  tokenA: string;
  msps: IOcpiParty[];
  cpos: IOcpiParty[];
}

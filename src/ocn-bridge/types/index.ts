export type UserOcnBridgeConfig = {
  port: string;
  url: string;
  nodeUrl: string;
  roles: Array<{
    countryCode: string;
    partyId: string;
    role: string;
    businessDetails: { name: string };
  }>;
  network: string;
  log: string;
  signatures: string;
  dryRun?: string;
  tokenA: string;
  signer: string;
};

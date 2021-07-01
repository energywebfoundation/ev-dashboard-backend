import {
  DefaultRegistry,
  IBridgeConfigurationOptions,
  ModuleImplementation,
} from '@energyweb/ocn-bridge';

export type EvDashboardConfig = {
  ocnBridge: IBridgeConfigurationOptions;
};

const required = (varName: string) => {
  if (!process.env[varName]) {
    throw Error(`${varName} is required`);
  }
  return varName;
};

// TODO: use joi (?)
export default (): EvDashboardConfig => ({
  ocnBridge: {
    port: parseInt(process.env.OCN_BRIDGE_PORT, 10) ?? 8090,
    publicBridgeURL: process.env.OCN_BRIDGE_URL ?? 'http://localhost:8090',
    ocnNodeURL: process.env.OCN_BRIDGE_NODE_URL ?? 'http://localhost:8080',
    modules: {
      implementation: ModuleImplementation.CUSTOM,
      receiver: ['sessions'],
      sender: [],
    },
    roles: [
      {
        country_code: 'DE',
        party_id: 'FLX',
        role: 'OTHER',
        business_details: { name: 'FlexHub' },
      },
    ],
    pluggableAPI: {}, // TODO
    pluggableDB: {
      getEndpoint: async () => 'endpoint',
      saveEndpoints: async () => undefined,
      getTokenB: async () => 'tokenb',
      setTokenB: async () => undefined,
      getTokenC: async () => 'tokenc',
      setTokenC: async () => undefined,
    }, // TODO
    pluggableRegistry: new DefaultRegistry('volta'), // TODO
    logger: true,
    dryRun: true,
    signatures: true,
    signer: required('OCN_BRIDGE_SIGNER'),
    tokenA: required('OCN_BRIDGE_TOKEN_A'),
  },
});

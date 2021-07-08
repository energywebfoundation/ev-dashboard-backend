export default () => ({
  ocnBridge: {
    port: process.env.OCN_BRIDGE_PORT,
    url: process.env.OCN_BRIDGE_URL,
    nodeUrl: process.env.OCN_BRIDGE_NODE_URL,
    roles: [
      {
        countryCode: process.env.OCN_BRIDGE_COUNTRY_CODE,
        partyId: process.env.OCN_BRIDGE_PARTY_ID,
        role: process.env.OCN_BRIDGE_ROLE,
        businessDetails: { name: process.env.OCN_BRIDGE_NAME },
      },
    ],
    network: process.env.OCN_BRIDGE_NETWORK,
    log: process.env.OCN_BRIDGE_LOG,
    dryRun: process.env.OCN_BRIDGE_DRY_RUN,
    signatures: process.env.OCN_BRIDGE_SIGNATURES,
    signer: process.env.OCN_BRIDGE_SIGNER,
    tokenA: process.env.OCN_BRIDGE_TOKEN_A,
  },
});

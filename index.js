const application = require('./dist');

module.exports = application;

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT || 8080),
      host: process.env.HOST,
      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
    socket: {
      port: +(process.env.PORT || 8081),
      host: process.env.HOST,
    },
    ocn: {
      enabled: process.env.OCN_ENABLED || true,
      // OCN environment: one of 'local', 'volta' or 'prod'
      stage: process.env.OCN_STAGE || 'local',
      // URL as accessible by OCN node
      bridgeURL: process.env.OCN_BRIDGE_URL || 'http://localhost:8090',
      // URL as accessible by bridge
      nodeURL: process.env.OCN_NODE_URL || 'http://localhost:8100',
      // The private key which registers Flex on the OCN; signs OCPI messages
      // note: stored in memory for convenience; will be replaced with key manager
      identity: process.env.OCN_IDENTITY,
      // OCPI "CREDENTIALS_TOKEN_A" used to initiate the credentials handshake with OCN node
      // Is invalidated after registration complete
      tokenA: process.env.OCN_TOKEN_A,
      // Configure MSPs to retrieve tokens from
      msps: [{country_code: 'DE', party_id: 'EVM'}],
      // Configure CPOs to retrieve locations from
      cpos: [{country_code: 'DE', party_id: 'EVC'}]
    },
  };
  application.main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

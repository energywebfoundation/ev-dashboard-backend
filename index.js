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
      enabled: true,
      stage: 'local',
      bridgeURL: 'http://localhost:8090',
      nodeURL: 'http://localhost:8100',
      identity: process.env.OCN_PRIVATE_KEY,
      tokenA: process.env.OCN_TOKEN_A,
    },
  };
  application.main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

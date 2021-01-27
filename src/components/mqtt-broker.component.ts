import {Component, inject} from '@loopback/core';
import {MqttDataSource} from '../datasources';

export class MqttBrokerComponent implements Component {
  constructor(@inject('datasources.mqtt') private dataSource: MqttDataSource) {
    console.info('MqttBrokerComponent component is initialized');
  }

  async start() {
    console.info('MqttBrokerComponent component is started');
    const port = this.dataSource.settings.port;
    const aedes = require('aedes')();
    const mqttBroker = require('net').createServer(aedes.handle);

    mqttBroker.listen(port, function () {
      console.log('MQTT broker listening on port', port);
    });

    // const offerWindowRepository = await app.getRepository(OfferWindowRepository);
    // console.log(this.offerWindowRepository);
  }

  async stop() {}

  exit() {
    console.error('Node must be down. Exiting app.');
    process.exit(1);
  }
}

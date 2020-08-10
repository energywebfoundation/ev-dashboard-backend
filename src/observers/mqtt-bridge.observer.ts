/* eslint-disable no-undef */
import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {MqttDataSource} from '../datasources/mqtt.datasource';
import {
  OfferRepository,
  ActivationSummaryRepository,
  ClaimRepository,
  AssetRepository,
} from '../repositories';
import {Socket} from 'socket.io';
import {OFFER_STATE, CLAIM_TYPE} from '../keys';
import {Claim, Asset} from '../models';
const jwt = require('jsonwebtoken');

const mqtt = require('mqtt');

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('mqtt')
export class MqttBridgeObserver implements LifeCycleObserver {
  private webSocket: Socket;
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: Application,
    @repository(OfferRepository) private offerRepository: OfferRepository,
    @repository(ClaimRepository) private claimRepository: ClaimRepository,
    @repository(AssetRepository) private assetRepository: AssetRepository,
    @repository(ActivationSummaryRepository)
    private activationSummaryRepository: ActivationSummaryRepository,
    @inject('datasources.mqtt') private dataSource: MqttDataSource,
  ) {
    console.log('MqttBridgeObserver observer is initialized');
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start
    console.log('MqttBridgeObserver observer is started');

    setTimeout(() => {
      const client = mqtt.connect(
        'mqtt://' +
          this.dataSource.settings.host +
          ':' +
          this.dataSource.settings.port,
      );

      client.on('message', async (topic: string, message: string) => {
        // message is Buffer
        console.log(
          '> MQTT: Receive message %s from channel %s',
          message.toString(),
          topic,
        );
        this.webSocket = this.app.getSync<Socket>('websocket');
        switch (topic) {
          case 'asset/jwtAsset': {
            const iot = JSON.parse(message);
            const payload = await jwt.decode(iot.jwt);
            console.log(payload);
            console.log(`mqtt-bridge.controller: ${topic} payload:`, payload);
            const updatedClaim = this.claimRepository.update(
              new Claim({
                issuerId: '', // issuer is Installer
                ownerId: payload.iss,
                claimTypeId: CLAIM_TYPE.ASSET,
                claimData: iot.jwt,
                id: payload.id,
              }),
            );
            console.log(
              `claim.controller: ${topic} updatedClaim:`,
              updatedClaim,
            );
            const partialAsset = {
              ownerId: payload.iss,
              claimId: payload.id,
              publicKey: payload.publicKey,
              serialNumber: payload.serialNumber,
              equipmentName: payload.equipmentName,
              manufacturer: payload.manufacturer,
              modelNumber: payload.modelNumber,
              assetTypeId: 0,
              assetStateId: 0,
            };
            console.log(partialAsset);
            this.assetRepository.create(new Asset(partialAsset));
            this.webSocket.emit('asset/create', partialAsset);
            break;
          }
          case 'fh/offerbundle/reject': {
            const offerObject = JSON.parse(message);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            // this.offerRepository.create(offerObject);
            break;
          }
          case 'did/offer/create': {
            const offerObject = JSON.parse(message);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            // this.offerRepository.create(offerObject);
            break;
          }
          case 'offer/summary': {
            const _summary = jwt.decode(message);
            const summary = JSON.parse(JSON.stringify(_summary));

            // let summary = { "offerid": "7f2f6c88-c3f0-42b6-92ff-595a90a206d1", "activations": [{ "interval": 2, "baseline": 100.1 }, { "interval": 4, "baseline": 100.1 }, { "interval": 7, "baseline": 100.1 }] };
            // console.log({ where: { offerId: summary.offerid } });
            this.offerRepository
              .findOne({where: {offerId: summary.offerid}})
              .then(offer => {
                console.log(offer);
                this.activationSummaryRepository.create({
                  offerId: offer?.id,
                  summary: summary,
                  timestamp: new Date().toUTCString(),
                });
                this.webSocket.emit('offer/summary', summary);
              });

            break;
          }
          case 'offer/confirm': {
            const offerObject = jwt.decode(message);
            console.log(offerObject);
            this.offerRepository
              .findOne({where: {offerId: offerObject.offerID}})
              .then(async (offer: any) => {
                console.log(offer);
                offer.offerStateId = OFFER_STATE.CONFIRM;
                await this.offerRepository.update(offer);
                this.webSocket.emit('did/offer/create', offer);
              });

            break;
          }
          case 'offer/submit': {
            // const offerObject = JSON.parse(message);
            const offerObject = jwt.decode(message);
            console.log(offerObject.offerID);
            this.offerRepository
              .findOne({where: {offerId: offerObject.offerID}})
              .then(async (offer: any) => {
                console.log(offer);
                offer.offerStateId = OFFER_STATE.PENDING_SUBMIT;
                await this.offerRepository.update(offer);
                this.webSocket.emit('did/offer/create', offer);
              });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            // this.offerRepository.create(offerObject).then(() => {
            //   // client.publish('did/offer/accept', JSON.stringify({
            //   //   "status": "accept",
            //   //   "offerID": offerObject.offerID
            //   // }));
            //   // io.emit("topic", offerObject);
            // });
            break;
          }
          default: {
            //statements;
            break;
          }
        }
      });

      client.on('connect', function () {
        console.log('connect');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.subscribe('#', (err: any) => {
          if (!err) {
            //console.log(`Subscribed to MQTT channels.`);
            client.publish('presence', 'MQTT bridge running ...');
          }
        });
      });
    }, 5000);
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
    console.log('MqttBridgeObserver stop');
  }
}

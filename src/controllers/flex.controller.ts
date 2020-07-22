import { inject } from "@loopback/core";
import { CountSchema, repository } from "@loopback/repository";
import { get, getModelSchemaRef, param, post, put, requestBody, RequestBodyObject } from "@loopback/rest";
import { MqttDataSource } from "../datasources";
import { Participant, Offer, OfferBundle, Asset, ActivationSummary, Constraints } from "../models";
import { OfferRepository, ParticipantRepository, OfferBundleRepository, ClaimRepository, AssetRepository, ActivationSummaryRepository, ConstraintsRepository } from "../repositories";
import { MERKLE_ROOT_SERVICE_PROVIDER, OFFER_TYPE, OFFER_STATE, MERKLE_ROOT_CONTRACT_PROVIDER, BUNDLE_STATE, ASSET_ACTIVATION_SERVICE, CONSTRAINTS } from "../keys";
import { MerkleRootService } from "../services";
import { uuid } from 'uuidv4';
import { Socket } from 'socket.io';
import * as config from '../datasources/merkle-root-contract.datasource.config.json';
import { AssetActivationService } from "../services/asset-activation.service";
import { unset, find, clone } from "lodash";


// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
const mqtt = require('mqtt');

export class FlexController {
  private client: any;

  constructor(
    @repository(OfferRepository)
    public offerRepository: OfferRepository,
    @inject('datasources.mqtt') private dataSource: MqttDataSource,
    @repository(ParticipantRepository)
    public participantRepository: ParticipantRepository,
    @repository(OfferBundleRepository)
    public offerBundleRepository: OfferBundleRepository,
    @repository(AssetRepository)
    public assetRepository: AssetRepository,
    @repository(ConstraintsRepository)
    public constraintsRepository: ConstraintsRepository,
    @repository(ActivationSummaryRepository)
    public activationSummaryRepository: ActivationSummaryRepository,
    @repository(ClaimRepository)
    public claimRepository: ClaimRepository,
    @inject(MERKLE_ROOT_SERVICE_PROVIDER) private merkleRootService: MerkleRootService,
    @inject(MERKLE_ROOT_CONTRACT_PROVIDER) protected connector: any,
    @inject('websocket') private webSocket: Socket,
    @inject(ASSET_ACTIVATION_SERVICE) private assetActivationService: AssetActivationService,
  ) {
    this.client = mqtt.connect(
      'mqtt://' +
      this.dataSource.settings.host +
      ':' +
      this.dataSource.settings.port,
    );
  }

  /**
   *
   * EW-Flex Code Start
   *
   */

  @get('/reset/db')
  async resetDatabase(): Promise<String> {   
      return this.assetRepository.find().then((assets) =>{
        assets.forEach(asset=>{
          this.client.publish("asset/"+ asset.serialNumber +"/control",JSON.stringify({command:"deregister"}));
        });
        return Promise.all(
          [
            this.offerRepository.deleteAll(),
            this.offerBundleRepository.deleteAll(),
            this.participantRepository.deleteAll(),
            this.claimRepository.deleteAll(),
            this.assetRepository.deleteAll(),
            this.activationSummaryRepository.deleteAll(),
            this.constraintsRepository.deleteAll()
          ],
        ).then(()=>{
          return new String("Success Delete");
        },()=>{
          throw new String("Error Delete");
        });  
      });
        
  } 


  @get('/testGenerateMerkleRoot', {
    responses: {
      '200': {
        description: 'Merkle Root Hash',
        content: { 'application/json': { rootHash: Object } },
      },
    },
  })
  async testGenerateMerkleRoot(): Promise<string> {
    let constraints = await this.constraintsRepository.find();
    console.log(constraints);
    this.offerRepository.find({ where: { offerType: OFFER_TYPE.SUPPLY} , order: ['price asc'],include: [{ "relation": "asset" }] }).then(recentOffers => {
      // console.log(constraints);
      // console.log(recentOffers);
      recentOffers.forEach((recentOffer:any) => {
        console.log(recentOffer);
        let constraint:any;
        if(recentOffer.asset.serialNumber == CONSTRAINTS["a9c30590-93cb-4e0b-bf0b-e59fdb96110b"]){
          constraint = find(constraints,["constraints","MP1"]);
        }else if(recentOffer.asset.serialNumber == CONSTRAINTS["2a39f69e-ddab-42d3-b37b-87ac52ef15a1"]){
          constraint = find(constraints,["constraints","MP1"]);
        }else if(recentOffer.asset.serialNumber == CONSTRAINTS["60a11da9-20b8-47bc-b365-a49d98277d05"]){
          constraint = find(constraints,["constraints","MP2"]);
        }else if(recentOffer.asset.serialNumber == CONSTRAINTS["c80b9a03-7009-40ef-987d-c7058b60c844"]){
          constraint = find(constraints,["constraints","MP2"]);
        }
        console.log(constraint);
        // var d = new Date(constraint.deliveryPeriod);
        // var n = Math.ceil(((d.getHours() * 60) + d.getMinutes()) / 60 * 4);
    

        // var _d = new Date(recentOffer.date);
        // var _n = Math.ceil(((_d.getHours() * 60) + _d.getMinutes()) / 60 * 4);
        // console.log(n + " " + _n);
        // if(d.getFullYear() == _d.getUTCFullYear() &&
        // d.getUTCMonth() == _d.getUTCMonth() &&
        // d.getUTCDay() == _d.getUTCDay() && recentOffer.capacity < constraint.limit){
        //   console.log(n + " ******* " + _n);
        // }
      });
      
    });
    return this.merkleRootService.generate(['a', 'b', 'c']);
  }

  @post('/assetcommand', {
    responses: {
      '200': {
        description: 'Send Command success',
      },
    },
  })
  async sentCommandIot(
    @requestBody() command: any,
  ): Promise<void> {
    console.log(command);
    if(command.payload.command == "submit_offer"){
      // this.client.publish(command.topic,JSON.stringify({
      //   command:"submit",
      //   offerID:command.payload.offerID
      // }));
      this.client.publish(command.topic,JSON.stringify({
        command:command.payload.command,
        offerID:command.payload.offerID
      }));
    }else if(command.payload.command == "send_activation_summary"){
      // this.client.publish(command.topic,JSON.stringify({
      //   command:"summary",
      //   offerID:command.payload.offerID
      // }));  
      this.client.publish(command.topic,JSON.stringify({
        command:command.payload.command,
        offerID:command.payload.offerID
      }));
    }else{
      this.client.publish(command.topic,JSON.stringify({
        command:command.payload.command
      }));
    }
    
  }

  @put('/activation/{id}', {
    responses: {
      '204': {
        description: 'RecentOffers PUT success',
      },
    },
  })
  async replaceById(
    @requestBody() offer: any,
  ): Promise<void> {
    console.log("99999999");
    console.log(offer);
    this.client.publish(offer.asset.serialNumber + '/offer/accept', JSON.stringify({
      "status": "accept",
      "offerID": offer.offerId
    }));
    unset(offer,"asset");
    unset(offer,"offerBundle");
    this.offerRepository.updateById(offer.id, offer);
    
  }

  @get('/trigger/bundle', {
    responses: {
      '200': {
        description: 'Trigger offer bundle',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async reserveBundle(

  ): Promise<void> {
    console.log("Trigger offer bundle By REST");
    this.offerRepository.find({ where: { offerType: OFFER_TYPE.DEMAND,offerStateId : OFFER_STATE.PENDING } }).then(results => {
      results.forEach(demandOffer => {
        console.log(demandOffer);
        if (demandOffer.offerStateId == OFFER_STATE.PENDING) {

          var d = new Date(demandOffer.date);
          var n = Math.ceil(((d.getHours() * 60) + d.getMinutes()) / 60 * 4);

          let offerBundle = new OfferBundle({
            timestamp: demandOffer.date,
            demandOfferId: demandOffer.id,
            offerBundleStateId: BUNDLE_STATE.RESERVED,
          });

          let _recentOffers: Array<Offer> = [];
          this.offerRepository.find({ where: { offerType: OFFER_TYPE.SUPPLY,offerStateId : OFFER_STATE.PENDING_SUBMIT } , order: ['price asc'] }).then(recentOffers => {
            const totalWindowCapacity = Number(demandOffer.capacity);
            let windowCapacity = 0;

            recentOffers.forEach(recentOffer => {
              console.log(recentOffer);
              var _d = new Date(recentOffer.date);
              var _n = Math.ceil(((_d.getHours() * 60) + _d.getMinutes()) / 60 * 4);
              console.log(n + " " + _n);
              console.log(d.toLocaleString() + " " + _d.toLocaleString());

              if (recentOffer.offerStateId == OFFER_STATE.PENDING_SUBMIT && _n == n &&
                d.getFullYear() == _d.getUTCFullYear() &&
                d.getUTCMonth() == _d.getUTCMonth() &&
                d.getUTCDay() == _d.getUTCDay() &&
                ((demandOffer.capacity > 0) ? "+" : "-") == ((recentOffer.capacity > 0) ? "+" : "-")) {
                console.log(recentOffer);
                let positiveCapacity = Number(recentOffer.capacity) < 0 ? Number(recentOffer.capacity) * -1 : Number(recentOffer.capacity);

                if (
                  positiveCapacity + windowCapacity <=
                  totalWindowCapacity
                ) {
                  windowCapacity = windowCapacity + positiveCapacity;
                  // offerBundle.offers.push(recentOffer);
                  _recentOffers.push(recentOffer);
                }
              }
            });
            offerBundle.capacity = windowCapacity;
            return _recentOffers;
          }).then(async (recentOffers) => {
            // console.log("====2====");

            if (_recentOffers.length > 0) {

              let _id: Array<string> = [];
              _recentOffers.forEach(offer => {
                _id.push(String(offer.id));
              });
              offerBundle.rootHash = await this.merkleRootService.generate(_id);
              offerBundle.uuid = uuid();
              this.connector.contract.methods
                .addMR(offerBundle.uuid, new Date().getTime(), "0x" + offerBundle.rootHash)
                .send({ from: config.options.defaultAccount });
              console.log(offerBundle);
              // this.offerBundleRepository.create(offerBundle.offers[0]);
              this.offerBundleRepository.create(offerBundle).then(data => {
                console.log("========");
                console.log(data);
                offerBundle = data;
                // this.offerBundleRepository.offerBundleState.caller();
                recentOffers.forEach(recentOffer => {
                  // recentOffer.offerStateId = "Pending Confirm";
                  recentOffer.offerStateId = OFFER_STATE.PENDING_CONFIRM;
                  recentOffer.offerBundleId = data.id;
                  this.offerRepository.update(recentOffer);
                  // this.offerRepository.replaceById(recentOffer.id, recentOffer);
                });
                
                this.webSocket.emit('offer/bundle/create', offerBundle);
                return data;
              }).then((data) => {
                demandOffer.offerStateId = OFFER_STATE.RESERVED;
                demandOffer.offerBundleId = data.id;
                console.log("******");
                console.log(demandOffer);
                this.offerRepository.update(demandOffer).then(() => {
                  // console.log(data);
                  this.webSocket.emit('offer/bundle/create', offerBundle);  
                });
                setTimeout(() => {
                  offerBundle.offerBundleStateId = BUNDLE_STATE.ACCEPTED;
                  this.offerBundleRepository.update(offerBundle);
                  this.webSocket.emit('offer/bundle/create', offerBundle);
                },30000);
                
              });
            }

          });
        }

      });
    });
  }

  @post('/offers/bid/offer', {
    responses: {
      '200': {
        description: 'Offer submited',
      },
    },
  })
  async BidOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              offer: {
                type: 'object',
                properties: {
                  capacity: { type: 'number' },
                  date: { type: 'string' },
                  timeslot: { type: 'number' },
                  price: { type: 'number' },
                  direction: { type: 'string' },
                  offerID: { type: 'string' }
                },
              },
              did: {
                type: 'object',
                properties: {
                  assetId: { type: 'number' },
                  serialNumber: { type: 'string' },
                },
              },
            },
            required: ['offer', 'did'],
          },
        },
      },
    })
    bidOrder: RequestBodyObject,
  ): Promise<any> {
    bidOrder.offer.offerID = uuid()
    console.log(bidOrder.offer);

    this.client.publish(bidOrder.did.serialNumber + '/offer/create', JSON.stringify(bidOrder.offer));
    this.webSocket.emit('did/offer/create', bidOrder.offer);

    return new Promise(resolve => {
      console.log(bidOrder.offer.offerID);
      resolve({
        "offerID": bidOrder.offer.offerID
      });
    });

  }

  @post('/user/register', {
    responses: {
      '200': {
        description: 'Participant model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Participant) } },
      },
    },
  })
  async createParticipant(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Participant, {
            title: 'NewParticipant',
            exclude: ['id'],
          }),
        },
      },
    })
    participant: Omit<Participant, 'id'>,
  ): Promise<Participant> {
    this.webSocket.emit('did/user/register', participant);
    return this.participantRepository.create(participant);
  }


  @post('/offer-bundle/activate', {
    responses: {
      '200': {
        description: 'Activation Request submited',
      },
    },
  })
  async ActivationRequest(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              activationRequest: {
                type: 'object',
                properties: {
                  reservedBundleId: { type: 'number' },
                  capacity: { type: 'number' }
                }
              }
            },
            required: ['activationRequest'],
          },
        },
      },
    })
    activationRequestBody: RequestBodyObject,
  ): Promise<any> {
    return new Promise(resolve => {
      this.offerBundleRepository.offers(activationRequestBody.activationRequest.reservedBundleId)
        .find({ where: { offerType: OFFER_TYPE.SUPPLY, offerStateId:OFFER_STATE.CONFIRM}, order: ['price asc']}).then(async (result) => {
          console.log("ActivationRequest");
          console.log(result);
          const offerBundle:OfferBundle = await this.offerBundleRepository.findById(Number(activationRequestBody.activationRequest.reservedBundleId));
          console.log(offerBundle);
          let activationBundle: any[] = [];
          result.forEach(async (offer: any, index) => {
            const asset:Asset = await this.assetRepository.findById(Number(offer.assetId));
            activationBundle.push({
              index: index,
              offerId: offer.offerId,
              assetId: asset.serialNumber,
              bundleCapacity: offerBundle.capacity,
              offerCapacity: offer.capacity

            });
            // console.log(activationBundle);
            // this.assetActivationService.startActivation(this.client, activationBundle);
          });

          return activationBundle;
        }).then((activationBundle)=>{
          this.assetActivationService.startActivation(this.client, activationBundle);
          resolve();
        });


    });
  }

  // @get('/offer-bundle/suspend-activation')
  // async suspendActivation(): Promise<void> {
  //   this.assetActivationService.stopActivation();
  // }

  @get('/owner-earned/{id}')
  async ownerCarned(@param.path.number('id') id: number, ): Promise<any> {


    return new Promise(resolve => {
      let totalEarned: number = 0;
      this.offerRepository.find({ where: { ownerId: id }, include: [{ "relation": "activationSummary" }] }).then(result => {
        // console.log(result);

        result.forEach((offer) => {
          let sum: number = 0;
          // let _data :ActivationIot = offer.activationSummary?.summary;
          if (offer.activationSummary?.summary) {
            // var keys = offer.activationSummary?.summary.toLocaleString();
            // console.log(offer.activationSummary?.summary);
            // console.log(JSON.stringify(offer.activationSummary?.summary));
            // console.log(keys);
            var values = JSON.parse(JSON.stringify(offer.activationSummary?.summary));
            values.activations.forEach((test: any) => {

              sum += Number(test.baseline);
              // console.log(sum);
            });
          }
          // console.log("1 " + sum);

          totalEarned += offer.price * sum;
          console.log(totalEarned);
          totalEarned = totalEarned/10000;
          console.log(totalEarned);
          // }
        });
        // console.log("2 " + totalEarned.toFixed(2));
        resolve(totalEarned.toFixed(5));
      });
      
    });
  }

  @get('/offer-bundle/suspend-activation')
  async suspendActivation(): Promise<void> {        
    this.assetActivationService.stopActivation();
  }

  @get('/activation-summary/{id}/owner')
  async ownerRecentActivation(@param.path.number('id') id: number, ): Promise<any> {
    return new Promise(resolve => {      
      this.offerRepository.findOne({ where: { ownerId: id,offerStateId:OFFER_STATE.CONFIRM },  order: ['id desc'] , include: [{ "relation": "activationSummary" }] }).then(offer => {                
        if(offer){
          let summaries: any[] = [];
          if (offer?.activationSummary?.summary) {
            summaries.push({
              assetId: offer.assetId,
              date: offer.created,
              activation: JSON.parse(JSON.stringify(offer.activationSummary?.summary)).activations            
            });
            summaries.sort(function compare(a, b) {
              var dateA:any = new Date(a.date);
              var dateB:any = new Date(b.date);
              return (dateB - dateA);
            });
            if (summaries.length > 0) {
              resolve(summaries[0]);
            } else {
              resolve([]);
            }     
          }   
        }else{
          resolve([]);
        }
      });
    });
  }

  /**
   *
   * EW-Flex Code End
   *
   */

}

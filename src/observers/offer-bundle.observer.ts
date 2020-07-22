import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
  inject,
  CoreBindings,
  Application
} from '@loopback/core';
import { repository } from '@loopback/repository';
import { OfferRepository, OfferBundleRepository, ConstraintsRepository } from '../repositories';
import { MERKLE_ROOT_SERVICE_PROVIDER, OFFER_TYPE, OFFER_STATE, BUNDLE_STATE, MERKLE_ROOT_CONTRACT_PROVIDER, CONSTRAINTS } from '../keys';
import { MerkleRootService } from '../services';
import { Socket } from 'socket.io';
import { OfferBundle, Offer } from '../models';
import * as config from '../datasources/merkle-root-contract.datasource.config.json';
import { uuid } from 'uuidv4';
import { find, unset } from "lodash";

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('offer')
export class OfferBundleSchedulerObserver implements LifeCycleObserver {
  private webSocket: Socket;
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @repository(OfferRepository) public offerRepository: OfferRepository,
    @inject(MERKLE_ROOT_SERVICE_PROVIDER) private merkleRootService: MerkleRootService,
    @inject(MERKLE_ROOT_CONTRACT_PROVIDER) protected connector: any,
    @repository(OfferBundleRepository)
    public offerBundleRepository: OfferBundleRepository,
    @repository(ConstraintsRepository)
    public constraintsRepository: ConstraintsRepository,
    
  ) {

    console.log('OfferBundleSchedulerObserver observer is initialized');
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start

    console.log('OfferBundleSchedulerObserver observer is started');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // this.offerRepository
    //   .find({where: {offerWindowId: 14}})
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   .then((offers: string | any[]) => {
    //     console.log(offers);
    //   });

    //   console.log(offerWindowTime.getHours() + " " + offerWindowEndTime.getHours());
    // }
    // this.webSocket = this.app.getSync<Socket>("websocket");
    // this.webSocket.emit('offer/bundle/create', "offerBundle");

    const async = require('async');
    const cronJob = require('cron').CronJob;
    new cronJob(
      '* * * * *',
      async () => {
        console.log("Trigger offer bundle");
        this.webSocket = this.app.getSync<Socket>("websocket");
        let constraints = await this.constraintsRepository.find();
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
              this.offerRepository.find({ where: { offerType: OFFER_TYPE.SUPPLY,offerStateId : OFFER_STATE.PENDING_SUBMIT } , order: ['price asc'], include: [{ "relation": "asset" }] }).then(recentOffers => {
                const totalWindowCapacity = Number(demandOffer.capacity);
                let windowCapacity = 0;
    
                recentOffers.forEach((recentOffer:any) => {
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
    
                    let constraint:any;
                    if(recentOffer.asset.serialNumber == CONSTRAINTS["a9c30590-93cb-4e0b-bf0b-e59fdb96110b"]){
                      constraint = find(constraints,["constraints","MP1"]);
                    }else if(recentOffer.asset.serialNumber == CONSTRAINTS["c80b9a03-7009-40ef-987d-c7058b60c844"]){
                      constraint = find(constraints,["constraints","MP1"]);
                    }else if(recentOffer.asset.serialNumber == CONSTRAINTS["60a11da9-20b8-47bc-b365-a49d98277d05"]){
                      constraint = find(constraints,["constraints","MP2"]);
                    }else if(recentOffer.asset.serialNumber == CONSTRAINTS["2a39f69e-ddab-42d3-b37b-87ac52ef15a1"]){
                      constraint = find(constraints,["constraints","MP2"]);
                    }
                    console.log(constraint);
                    // d = new Date(constraint.deliveryPeriod);
                    // n = Math.ceil(((d.getHours() * 60) + d.getMinutes()) / 60 * 4);
                

                    // _d = new Date(recentOffer.date);
                    // _n = Math.ceil(((_d.getHours() * 60) + _d.getMinutes()) / 60 * 4);
                    // console.log(n + " " + _n);
                    unset(recentOffer,"asset");
                    if(constraint == null){
                      if (
                        positiveCapacity + windowCapacity <=
                        totalWindowCapacity
                      ) {
                        windowCapacity = windowCapacity + positiveCapacity;
                        // offerBundle.offers.push(recentOffer);
                        _recentOffers.push(recentOffer);
                      }
                    }else{
                      if( recentOffer.capacity <= constraint.limit){
                        // console.log(n + " ******* " + _n);
                        if (
                          positiveCapacity + windowCapacity <=
                          totalWindowCapacity
                        ) {
                          windowCapacity = windowCapacity + positiveCapacity;
                          // offerBundle.offers.push(recentOffer);
                          _recentOffers.push(recentOffer);
                        }
                      }  
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
                      this.offerBundleRepository.findOne({where:{id:offerBundle.id,offerBundleStateId:BUNDLE_STATE.RESERVED}}).then((_offerBundle:any)=>{
                        if(_offerBundle){
                          _offerBundle.offerBundleStateId = BUNDLE_STATE.ACCEPTED;
                          this.offerBundleRepository.update(_offerBundle);
                          this.webSocket.emit('offer/bundle/create', _offerBundle);
                        }
                      });
                    },30000);
                    
                  });
                }
    
              });
            }
    
          });
        });
      },
      null,
      true,
    );
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
    console.log('OfferBundleSchedulerObserver stop');
  }
}

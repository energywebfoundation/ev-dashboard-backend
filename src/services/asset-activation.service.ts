import {bind, ContextTags, BindingScope} from '@loopback/core';
const cronJob = require('cron').CronJob;
import {Socket} from 'socket.io';
import {inject} from '@loopback/context';
import {random, orderBy} from 'lodash';

@bind({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.NAMESPACE]: 'services'},
})
export class AssetActivationService {
  private activationScheduler: any;
  public deviceActivationIndex: any = 0;

  constructor(@inject('websocket') private webSocket: Socket) {}

  public startActivation(mqttInstance: any, offerAssets: any[]): void {
    this.deviceActivationIndex = 0;
    const websocketInstance = this.webSocket;

    if (this.activationScheduler) {
      this.activationScheduler.stop();
    }
    this.activationScheduler = new cronJob({
      cronTime: '*/5 * * * * *',
      onTick: () => {
        // console.log(offerAssets);
        console.log(this.deviceActivationIndex);

        if (this.deviceActivationIndex < 179 && offerAssets.length > 0) {
          let totalCapacity = random(1, offerAssets[0].bundleCapacity);
          const lfc = totalCapacity;
          // console.log("totalmain " + totalCapacity);
          offerAssets = orderBy(offerAssets, ['index'], ['asc']);
          offerAssets.forEach(offerAssetItem => {
            // console.log(offerAssetItem);
            totalCapacity = totalCapacity - offerAssetItem.offerCapacity;

            if (offerAssetItem.offerCapacity >= 0) {
              if (totalCapacity + Number(offerAssetItem.offerCapacity) >= 0) {
                // console.log("total " + totalCapacity);
                mqttInstance.publish(
                  offerAssetItem.assetId + '/offer/activate',
                  JSON.stringify({
                    offerID: offerAssetItem.offerId,
                    assetID: offerAssetItem.assetId,
                    amount:
                      totalCapacity >= 0
                        ? offerAssetItem.offerCapacity
                        : totalCapacity + offerAssetItem.offerCapacity,
                    baseline:
                      totalCapacity >= 0
                        ? offerAssetItem.offerCapacity
                        : totalCapacity + offerAssetItem.offerCapacity,
                  }),
                );
                // console.log({
                //   "offerID": offerAssetItem.offerId,
                //   "assetID": offerAssetItem.assetId,
                //   "amount": (totalCapacity >= 0)?offerAssetItem.offerCapacity:totalCapacity + offerAssetItem.offerCapacity,
                //   "baseline": activationRecord[offerAssetItem.assetId],
                // });
                websocketInstance.emit('offer/activate', {
                  totalCapacity: offerAssetItem.bundleCapacity,
                  interval: this.deviceActivationIndex,
                  index: offerAssetItem.index,
                  LFC: lfc,
                  offerID: offerAssetItem.offerId,
                  assetID: offerAssetItem.assetId,
                  amount:
                    totalCapacity >= 0
                      ? offerAssetItem.offerCapacity
                      : totalCapacity + offerAssetItem.offerCapacity,
                  baseline:
                    totalCapacity >= 0
                      ? offerAssetItem.offerCapacity
                      : totalCapacity + offerAssetItem.offerCapacity,
                });
              } else {
                // console.log({
                //   "offerID": offerAssetItem.offerId,
                //   "assetID": offerAssetItem.assetId,
                //   "amount": 0,
                //   "amount1": 0,
                //   "baseline": activationRecord[offerAssetItem.assetId],
                // });
                websocketInstance.emit('offer/activate', {
                  totalCapacity: offerAssetItem.bundleCapacity,
                  interval: this.deviceActivationIndex,
                  index: offerAssetItem.index,
                  LFC: lfc,
                  offerID: offerAssetItem.offerId,
                  assetID: offerAssetItem.assetId,
                  amount: 0,
                  baseline: 0,
                });
              }
            } else {
              // console.log({
              //   "offerID": offerAssetItem.offerId,
              //   "assetID": offerAssetItem.assetId,
              //   "amount": 0,
              //   "amount1": 0,
              //   "baseline": activationRecord[offerAssetItem.assetId],
              // });
              websocketInstance.emit('offer/activate', {
                totalCapacity: offerAssetItem.bundleCapacity,
                interval: this.deviceActivationIndex,
                index: offerAssetItem.index,
                LFC: lfc,
                offerID: offerAssetItem.offerId,
                assetID: offerAssetItem.assetId,
                amount: 0,
                baseline: 0,
              });
            }
          });

          this.deviceActivationIndex++;
        } else {
          this.activationScheduler.stop();
        }
      },
      start: false,
    });
    this.activationScheduler.start();
  }

  public stopActivation(): void {
    this.activationScheduler.stop();
  }
}

import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Claim, Asset, Participant } from '../models';
import { ClaimRepository, AssetRepository, ParticipantRepository } from '../repositories';
import { inject } from '@loopback/core';
import { MqttDataSource } from '../datasources';
import jwt from 'jsonwebtoken';
import { Socket } from "socket.io";
import { CLAIM_TYPE } from '../keys';
import config from '../datasources/mqtt.datasource.config.json';

const mqtt = require('mqtt');

export class ClaimController {
  private client: any;

  constructor(
    @repository(ClaimRepository)
    public claimRepository: ClaimRepository,
    @repository(AssetRepository)
    public assetRepository: AssetRepository,
    @inject('datasources.mqtt') private dataSource: MqttDataSource,
    @inject('websocket') private webSocket: Socket,
    @repository(ParticipantRepository)
    public participantRepository: ParticipantRepository,
  ) {
    this.client = mqtt.connect(
      'mqtt://' +
      this.dataSource.settings.host +
      ':' +
      this.dataSource.settings.port,
    );
  }

  @post('/claims', {
    responses: {
      '200': {
        description: 'Claim model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Claim) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Claim, {
            title: 'NewClaim',
            exclude: ['id'],
          }),
        },
      },
    })
    claim: Omit<Claim, 'id'>,
  ): Promise<object | void> {

    switch (claim.claimTypeId) {
      case CLAIM_TYPE.OWNER: {
        const stored = await this.claimRepository.create(claim);
        this.webSocket.emit("GovBody", claim);
        return { claimId: `${stored.id}`, claimData: stored.claimData }
        break;
      }
      /**
       * Posted by the asset owner only. Notice that the claim.claimData is encoded object of form:
       * {
       *  signer, did, claimData: {equipmentName, manufacture, modelNumber, serialNumber, iss}
       * }
       */
      case CLAIM_TYPE.ASSET:
        {
          const payload = jwt.decode(String(claim.claimData)) as {
            claimData:
            { equipmentName: string, manufacture: string, modelNumber: string, serialNumber: string }
          };
          const uid = payload.claimData.serialNumber;
          const storedClaim = await (await this.claimRepository.create(claim));
          console.log('claim.controller: stored claim:', storedClaim);

          this.client.publish(`asset/${uid}/register`, JSON.stringify({
            id: storedClaim.id,
            claimData: storedClaim.claimData,
            claimType: "Public",
            claimUrl: storedClaim.claimData
          }));
          // Imitate asset approval for testing
          // this.client.publish(`asset/jwtAsset`, JSON.stringify({
          //   jwt: jwt.sign(
          //     {
          //       ...payload.claimData,
          //       iss: storedClaim.ownerId,
          //       id: storedClaim.id,
          //       publicKey: 'test-without-asset-public-key'
          //     },
          //     'secret')
          // }));
        }
    }
    
  }

  @get('/claims/count', {
    responses: {
      '200': {
        description: 'Claim model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Claim)) where?: Where<Claim>,
  ): Promise<Count> {
    return this.claimRepository.count(where);
  }

  @get('/claims', {
    responses: {
      '200': {
        description: 'Array of Claim model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Claim, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Claim)) filter?: Filter<Claim>,
  ): Promise<Claim[]> {
    return this.claimRepository.find(filter);
  }

  @patch('/claims', {
    responses: {
      '200': {
        description: 'Claim PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Claim, { partial: true }),
        },
      },
    })
    claim: Claim,
    @param.query.object('where', getWhereSchemaFor(Claim)) where?: Where<Claim>,
  ): Promise<Count> {
    return this.claimRepository.updateAll(claim, where);
  }

  @get('/claims/{id}', {
    responses: {
      '200': {
        description: 'Claim model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Claim, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Claim)) filter?: Filter<Claim>
  ): Promise<Claim> {
    return this.claimRepository.findById(id, filter);
  }

  @patch('/claims/{id}', {
    responses: {
      '204': {
        description: 'Claim PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Claim, { partial: true }),
        },
      },
    })
    claim: Claim,
  ): Promise<void> {
    await this.claimRepository.updateById(id, claim);
  }

  @put('/claims/{id}', {
    responses: {
      '204': {
        description: 'Claim PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() claim: Claim,
  ): Promise<void> {
    console.log('claim.controller.put:', claim);
    const decodedClaimData = jwt.decode(claim.claimData as string) as { [key: string]: string };
    claim.claimUrl = `http://${config.host}:${config.port}/claims/${claim.id}`;
    await this.claimRepository.replaceById(id, claim);
    switch (claim.claimTypeId) {
      case CLAIM_TYPE.OWNER: {
        await this.participantRepository.create(new Participant({
          did: claim.ownerId,
          meteringAddress: decodedClaimData.meterAddr,
          name: decodedClaimData.name,
          organizationType: decodedClaimData.orgType,
          postalAddress: decodedClaimData.postAddr,
        }));
        this.webSocket.emit(`approve/${claim.ownerId}`, claim);
        break;
      }
      // Either Installer add approves and nofifies or Owner sets isServicePoint flag
      case CLAIM_TYPE.ASSET: {
        const assets = await this.assetRepository.find({
          where: {ownerId:decodedClaimData.iss,serialNumber:decodedClaimData.serialNumber}
        });
        console.log('claim.controller.put: assets:', assets);
        console.log('claim.controller.put: decodedClaimData:', decodedClaimData);
        const assetToApprove = assets.find(a => a.serialNumber === decodedClaimData.serialNumber);
        console.log('claim.controller.put: asset to approve:', assetToApprove);
        if (assetToApprove) {
          assetToApprove.approved = 'true';
          await this.assetRepository.replaceById(Number(assetToApprove.id), assetToApprove);
          this.webSocket.emit(`asset/${decodedClaimData.serialNumber}/jwtInstaller`, claim);
        }
      }
    }

    this.webSocket.emit("GovBody", claim);

  }

  @del('/claims/{id}', {
    responses: {
      '204': {
        description: 'Claim DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.claimRepository.deleteById(id);
  }
}

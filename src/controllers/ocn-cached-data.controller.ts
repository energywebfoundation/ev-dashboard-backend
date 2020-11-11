import { inject } from '@loopback/core';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import { IEvse, IGeoLocation } from '@shareandcharge/ocn-bridge';
import { HDNode } from '@ethersproject/hdnode'
import { AssetIdentity, ChargePointModel, chargePointModels } from '../datasources/ev-dashboard/charge-point-models';
import { VehicleModel, vehicleModels } from '../datasources/ev-dashboard/vehicle-models';
import { OCPI_LOCATION_REPOSITORY, OCPI_TOKEN_REPOSITORY, REGISTRY_SERVICE_PROVIDER, OCN_CACHE_METADATA_REPOSITORY } from '../keys';
import { OcpiLocation, OcpiLocationRelations, OcpiToken, OcpiTokenRelations, OcnCacheMetadata } from '../models';
import { OcpiLocationRepository, OcpiTokenRepository, OcnCacheMetadataRepository } from '../repositories';
import { RegistryService } from '../services/registry.service';

interface IEvseBasic extends ChargePointModel, AssetIdentity {
  available: boolean;
  coordinates: IGeoLocation;
  operator: string;
}

interface IVehicleBasic extends VehicleModel, AssetIdentity {
  connected: boolean;
  publicKey: string;
}

const node = HDNode.fromMnemonic('arrow empty stomach rival anger pottery hotel thing curtain goose embark initial');

export class OcnCachedDataController {
  constructor(
    @inject(OCPI_LOCATION_REPOSITORY)
    public ocpiLocationRepository: OcpiLocationRepository,
    @inject(OCPI_TOKEN_REPOSITORY)
    public ocpiTokenRepository: OcpiTokenRepository,
    @inject(OCN_CACHE_METADATA_REPOSITORY)
    public ocnCacheMetadataRepository: OcnCacheMetadataRepository,
    @inject(REGISTRY_SERVICE_PROVIDER)
    public registryService: RegistryService
  ) { }

  /**
   * Get list of evses cached from OCN
   */
  @get('/evses', {
    responses: {
      '200': {
        description: 'Array of EVSE ids',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: 'object',
            },
          },
        },
      },
    },
  })
  async findEvses(
    @param.query.string('owner') owner?: string
  ): Promise<IEvseBasic[]> {
    // TODO: if owner present, check registry for country_code/party_id
    let locations: (OcpiLocation & OcpiLocationRelations)[]

    if (owner) {
      const where = await this.registryService.resolveOcnIdentity(owner);
      locations = await this.ocpiLocationRepository.find({ where });
    } else {
      locations = await this.ocpiLocationRepository.find();
    }

    const evses: IEvseBasic[] = []

    for (const [iL, location] of locations.entries()) {
      for (const [iE, evse] of (location.evses ?? []).entries()) {
        const publicKey = node.derivePath(`m/44'/60'/0'/${iL}/${iE}`).address;
        if (evse?.evse_id) {
          evses.push({
            id: evse.evse_id,
            publicKey,
            serviceEndpoint: `https://innogy.de/${evse.uid}`,
            available: evse.status !== 'CHARGING',
            coordinates: location.coordinates,
            operator: location.operator?.name
              ?? `Unknown operator (${location.country_code}:${location.party_id}})`,
            ...chargePointModels[0]
          })
        }
      }
    }

    return evses;
  }

  /**
   * Find one evse (inefficient as we don't have a separate Evse repository)
   */
  @get('/evses/{id}', {
    responses: {
      '200': {
        description: 'Evse interface instance',
        content: {
          'application/json': {
            schema: 'IEvse',
          },
        },
      },
    },
  })
  async findEvseById(
    @param.path.string('id') id: string,
  ): Promise<IEvse | undefined> {
    const locations = await this.ocpiLocationRepository.find();
    let evse: IEvse | undefined

    for (const location of locations) {
      evse = location.evses?.find(evse => evse.evse_id === id)
      if (evse) {
        break
      }
    }

    return evse
  }

  /**
   * Get list of evses cached from OCN
   */
  @get('/vehicles', {
    responses: {
      '200': {
        description: 'Array of Vehicle ids',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: 'object',
            },
          },
        },
      },
    },
  })
  async findVehicles(
    @param.query.string('owner') owner?: string
  ): Promise<IVehicleBasic[]> {
    // TODO: if owner present, check registry for country_code/party_id
    let tokens: (OcpiToken & OcpiTokenRelations)[]

    if (owner) {
      const where = await this.registryService.resolveOcnIdentity(owner);
      tokens = await this.ocpiTokenRepository.find({ where });
    } else {
      tokens = await this.ocpiTokenRepository.find();
    }

    return tokens.map((token, index) => {
      const vehicleModel = vehicleModels[index%vehicleModels.length]
      const publicKey = node.derivePath(`m/44'/60'/1'/0/${index}`).address
      return {
        ...vehicleModel,
        id: token.uid,
        serviceEndpoint: `https://${vehicleModel.brandName.toLowerCase()}.com/vehicle/${token.uid}`,
        publicKey,
        connected: false
      }
    });
  }

  /**
   * Find one vehicle (mapped to OCPI token)
   */
  @get('/vehicles/{id}', {
    responses: {
      '200': {
        description: 'Token model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(OcpiToken),
          },
        },
      },
    },
  })
  async findVehicleById(
    @param.path.string('id') id: string,
  ): Promise<OcpiToken | undefined> {
    const token = await this.ocpiTokenRepository.findOne({ where: { uid: id } });
    return token ?? undefined
  }

  /**
   * Get cache metadata
   */
  @get('/metadata', {
    responses: {
      '200': {
        description: 'OCN Cache Metadata instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(OcnCacheMetadata),
          },
        },
      },
    },
  })
  async findMetadata(): Promise<OcnCacheMetadata | undefined> {
    const metadata = await this.ocnCacheMetadataRepository.getLatest();
    return metadata ?? undefined
  }
}

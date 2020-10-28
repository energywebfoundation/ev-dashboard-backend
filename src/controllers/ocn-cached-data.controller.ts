import { inject } from '@loopback/core';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import { IEvse, IGeoLocation } from '@shareandcharge/ocn-bridge';
import { OCPI_LOCATION_REPOSITORY, OCPI_TOKEN_REPOSITORY, REGISTRY_SERVICE_PROVIDER } from '../keys';
import {OcpiLocation, OcpiLocationRelations, OcpiToken, OcpiTokenRelations} from '../models';
import {OcpiLocationRepository, OcpiTokenRepository} from '../repositories';
import { RegistryService } from '../services/registry.service';

interface IEvseBasic {
  id: string;
  available: boolean;
  coordinates: IGeoLocation;
}

export class OcnCachedDataController {
  constructor(
    @inject(OCPI_LOCATION_REPOSITORY)
    public ocpiLocationRepository : OcpiLocationRepository,
    @inject(OCPI_TOKEN_REPOSITORY)
    public ocpiTokenRepository : OcpiTokenRepository,
    @inject(REGISTRY_SERVICE_PROVIDER)
    public registryService : RegistryService
  ) {}

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
              items: 'string',
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

    for (const location of locations) {
      for (const evse of location.evses ?? []) {
        if (evse?.evse_id) {
          evses.push({
            id: evse.evse_id,
            available: evse.status !== 'CHARGING',
            coordinates: location.coordinates
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
              items: 'string',
            },
          },
        },
      },
    },
  })
  async findVehicles(
    @param.query.string('owner') owner?: string
  ): Promise<string[]> {
    // TODO: if owner present, check registry for country_code/party_id
    let tokens: (OcpiToken & OcpiTokenRelations)[]

    if (owner) {
      const where = await this.registryService.resolveOcnIdentity(owner);
      tokens = await this.ocpiTokenRepository.find({ where });
    } else {
      tokens = await this.ocpiTokenRepository.find();
    }

    return tokens.map(token => token.contract_id);
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
    const token = await this.ocpiTokenRepository.findOne({ where: { contract_id: id }});
    return token ?? undefined
  }

}

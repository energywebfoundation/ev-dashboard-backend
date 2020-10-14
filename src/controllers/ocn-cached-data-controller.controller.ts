import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { IEvse } from '@shareandcharge/ocn-bridge';
import {OcpiLocation, OcpiLocationRelations, OcpiToken, OcpiTokenRelations} from '../models';
import {OcpiLocationRepository, OcpiTokenRepository} from '../repositories';
import { RegistryService } from '../services/registry.service';

export class OcnCachedDataControllerController {
  constructor(
    @repository(OcpiLocationRepository)
    public ocpiLocationRepository : OcpiLocationRepository,
    public ocpiTokenRepository : OcpiTokenRepository,
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
  async findEvse(
    @param.query.string('owner') owner?: string
  ): Promise<string[]> {
    // TODO: if owner present, check registry for country_code/party_id
    let locations: (OcpiLocation & OcpiLocationRelations)[]

    if (owner) {
      const where = await this.registryService.resolveOcnIdentity(owner);
      locations = await this.ocpiLocationRepository.find({ where });
    } else {
      locations = await this.ocpiLocationRepository.find();
    }
    
    const evses: string[] = []

    locations
      .map(location => location.evses)
      .flat()
      .forEach(evse => {
        if (evse?.evse_id) {
          evses.push(evse.evse_id)
        }
      })

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
    @param.path.number('id') id: string,
  ): Promise<IEvse | undefined> {
    const locations = await this.ocpiLocationRepository.find();
    let evse: IEvse | undefined

    locations.forEach(location => {
      const evseMatch = location.evses?.find(evse => evse.evse_id === id)
      evse = evseMatch
    })

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
    @param.path.number('id') id: string,
  ): Promise<OcpiToken | undefined> {
    const token = await this.ocpiTokenRepository.findOne({ where: { contract_id: id }});
    return token ?? undefined
  }

}

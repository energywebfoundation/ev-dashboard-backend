import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Claim,
  ClaimType,
} from '../models';
import {ClaimRepository} from '../repositories';

export class ClaimClaimTypeController {
  constructor(
    @repository(ClaimRepository)
    public claimRepository: ClaimRepository,
  ) { }

  @get('/claims/{id}/claim-type', {
    responses: {
      '200': {
        description: 'ClaimType belonging to Claim',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ClaimType)},
          },
        },
      },
    },
  })
  async getClaimType(
    @param.path.number('id') id: typeof Claim.prototype.id,
  ): Promise<ClaimType> {
    return this.claimRepository.claimType(id);
  }
}

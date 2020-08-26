import {bind} from '@loopback/core';
import {IPluggableAPI} from '@shareandcharge/ocn-bridge';
import {ISession} from '@shareandcharge/ocn-bridge';
import {repository} from '@loopback/repository';
import {OcpiSessionRepository} from '../repositories';
import {OCN_BRIDGE_API_PROVIDER} from '../keys';

@bind.provider({tags: {key: OCN_BRIDGE_API_PROVIDER}})
export class OcnBridgeApiProvider {
  constructor(
    @repository(OcpiSessionRepository)
    private sessionRepository: OcpiSessionRepository,
  ) {}

  value(): IPluggableAPI {
    return {
      sessions: {
        receiver: {
          update: async (session: ISession) => {
            const found = await this.sessionRepository.findOne({
              where: {
                country_code: session.country_code,
                party_id: session.party_id,
                id: session.id,
              },
            });
            if (found) {
              await this.sessionRepository.replaceById(found._id, session);
            } else {
              await this.sessionRepository.create(session);
            }
          },
        },
      },
    };
  }
}

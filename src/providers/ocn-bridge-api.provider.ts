import {bind, ContextTags, inject} from '@loopback/core';
import {IPluggableAPI} from '@shareandcharge/ocn-bridge';
import {ISession} from '@shareandcharge/ocn-bridge';
import {IChargeDetailRecord} from '@shareandcharge/ocn-bridge/dist/models/ocpi/cdrs';
import {repository} from '@loopback/repository';
import {OcpiSessionRepository, OcpiCdrRepository} from '../repositories';
import {OCN_BRIDGE_API_PROVIDER} from '../keys';

@bind.provider({tags: {key: OCN_BRIDGE_API_PROVIDER}})
export class OcnBridgeApiProvider {
  constructor(
    @repository(OcpiSessionRepository)
    private sessionRepository: OcpiSessionRepository,
    @repository(OcpiCdrRepository) private cdrRepository: OcpiCdrRepository,
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
      cdrs: {
        receiver: {
          get: async (country_code: string, party_id: string, id: string) => {
            const found = await this.cdrRepository.findOne({
              where: {country_code, party_id, id},
            });
            if (!found) {
              throw Error(`No cdr with id=${id} found.`);
            }
            return found;
          },
          create: async (cdr: IChargeDetailRecord) => {
            const found = await this.cdrRepository.findOne({
              where: {
                country_code: cdr.country_code,
                party_id: cdr.party_id,
                id: cdr.id,
              },
            });
            if (found) {
              throw Error('Cdr already exists.');
            }
            await this.cdrRepository.create(cdr);
          },
        },
      },
    };
  }
}

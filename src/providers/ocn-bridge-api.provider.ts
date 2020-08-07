import { bind, ContextTags, inject } from '@loopback/core'
import { IPluggableAPI } from '@shareandcharge/ocn-bridge';
import { ISession } from '@shareandcharge/ocn-bridge/dist/models/ocpi/session';
import { IChargeDetailRecord } from '@shareandcharge/ocn-bridge/dist/models/ocpi/cdrs';
import { repository } from '@loopback/repository';
import { OcpiSessionRepository, OcpiCdrRepository } from '../repositories'


@bind.provider({ tags: { key: 'providers.ocnBridgeApiProvider' } })
export class OcnBridgeApiProvider {

    constructor(
        @repository(OcpiSessionRepository) private sessionRepository: OcpiSessionRepository,
        @repository(OcpiCdrRepository) private cdrRepository: OcpiCdrRepository,
    ) {}

    value(): IPluggableAPI {
        return {
            sessions: {
                receiver: {
                    update: async (session: ISession) => {
                        await this.sessionRepository.create(session)
                    }
                }
            },
            cdrs: {
                receiver: {
                    get: async (id: string) => {
                        const found = await this.cdrRepository.findOne({ where: {id}})
                        return found as IChargeDetailRecord | undefined
                    },
                    create: async (cdr: IChargeDetailRecord) => {
                        await this.cdrRepository.create(cdr)
                    }
                }
            }
        }
    }

}
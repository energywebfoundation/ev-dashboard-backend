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
                        const found = await this.sessionRepository.findOne({ where: {
                            country_code: session.country_code,
                            party_id: session.party_id,
                            id: session.id 
                        }})
                        if (found) {
                            await this.sessionRepository.replaceById(found._id, session)
                        } else {
                            await this.sessionRepository.create(session)
                        }
                    }
                }
            },
            cdrs: {
                receiver: {
                    get: async (id: string) => {
                        const found = await this.cdrRepository.findOne({ where: {id}})
                        if (!found) {
                            throw Error(`No cdr with id=${id} found.`)
                        }
                        return found
                    },
                    create: async (cdr: IChargeDetailRecord) => {
                        const found = await this.cdrRepository.findOne({ where: {
                            country_code: cdr.country_code,
                            party_id: cdr.party_id,
                            id: cdr.id
                        }})
                        if (found) {
                            throw Error('Cdr already exists.')
                        }
                        await this.cdrRepository.create(cdr)
                    }
                }
            }
        }
    }

}
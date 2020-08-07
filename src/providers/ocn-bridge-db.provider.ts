import { bind, ContextTags } from '@loopback/core'
import { IPluggableDB } from '@shareandcharge/ocn-bridge';
import { repository } from '@loopback/repository';
import { OcnConnectionRepository, OcpiEndpointRepository } from '../repositories'
import { OcnConnection } from '../models';
import { IVersionDetail } from '@shareandcharge/ocn-bridge/dist/models/ocpi/versions';

@bind.provider({ tags: { key: 'providers.ocnBridgeDbProvider' } })
export class OcnBridgeDbProvider {

    constructor(
        @repository(OcnConnectionRepository) private ocnConnectionRepository: OcnConnectionRepository,
        @repository(OcpiEndpointRepository) private ocpiEndpointRepository: OcpiEndpointRepository,
    ) {}

    value(): IPluggableDB {
        return {
            getTokenB: async () => {
                const connection = await this.ocnConnectionRepository.findById(1, {fields: {tokenB: true}})
                return connection?.tokenB;
            },
            setTokenB: async (tokenB: string) => {
                const existent = await this.ocnConnectionRepository.find()
                console.log('existent:', existent)
                if (existent[0]) {
                    console.log('replacing')
                    await this.ocnConnectionRepository.replaceById(1, Object.assign(existent[0], {tokenB}))
                } else {
                    console.log('saving')
                    await this.ocnConnectionRepository.create(new OcnConnection({ tokenB}))
                }
            },
            getTokenC: async () => {
                const connection = await this.ocnConnectionRepository.findById(1, {fields: {tokenC: true}})
                return connection?.tokenC;
            },
            setTokenC: async (tokenC: string) => {
                const existent = await this.ocnConnectionRepository.find()
                if (existent[0]) {
                    await this.ocnConnectionRepository.replaceById(1, Object.assign(existent[0], {tokenC}))
                } else {
                    await this.ocnConnectionRepository.save(new OcnConnection({ id: 1, tokenC}))
                }

            },
            getEndpoint: async (identifier: string, role: string) => {
                const endpoint = await this.ocpiEndpointRepository.findOne({
                    where: { identifier, role }
                })
                if (!endpoint) {
                    throw Error(`Endpoint for ${identifier} ${role} not found.`)
                }
                return endpoint.url
            },
            saveEndpoints: async (versionDetail: IVersionDetail) => {
                await this.ocpiEndpointRepository.createAll(versionDetail.endpoints)
            }
        }
    }

}
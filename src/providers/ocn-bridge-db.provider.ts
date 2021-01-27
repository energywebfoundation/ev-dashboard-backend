import { bind, ContextTags } from '@loopback/core';
import { repository } from '@loopback/repository';
import { IPluggableDB, IVersionDetail } from '@energyweb/ocn-bridge';
import { OcnConnectionRepository, OcpiEndpointRepository } from '../repositories';
import { OcnConnection } from '../models';
import { OCN_BRIDGE_DB_PROVIDER } from '../keys';

@bind.provider({ tags: { key: OCN_BRIDGE_DB_PROVIDER } })
export class OcnBridgeDbProvider {
  constructor(
    @repository(OcnConnectionRepository)
    private ocnConnectionRepository: OcnConnectionRepository,
    @repository(OcpiEndpointRepository)
    private ocpiEndpointRepository: OcpiEndpointRepository,
  ) { }

  value(): IPluggableDB {
    return {
      getTokenB: async () => {
        const connection = await this.ocnConnectionRepository.findOne({
          where: { id: 1 },
          fields: { tokenB: true },
        });
        return connection?.tokenB || '';
      },
      setTokenB: async (tokenB: string) => {
        const existent = await this.ocnConnectionRepository.findOne({
          where: { id: 1 },
        });
        if (existent) {
          await this.ocnConnectionRepository.replaceById(
            1,
            Object.assign(existent, { tokenB }),
          );
        } else {
          await this.ocnConnectionRepository.create(
            new OcnConnection({ tokenB }),
          );
        }
      },
      getTokenC: async () => {
        const connection = await this.ocnConnectionRepository.findOne({
          where: { id: 1 },
          fields: { tokenC: true },
        });
        return connection?.tokenC || '';
      },
      setTokenC: async (tokenC: string) => {
        const existent = await this.ocnConnectionRepository.findOne({
          where: { id: 1 },
        });
        if (existent) {
          await this.ocnConnectionRepository.replaceById(
            1,
            Object.assign(existent, { tokenC }),
          );
        } else {
          await this.ocnConnectionRepository.save(
            new OcnConnection({ id: 1, tokenC }),
          );
        }
      },
      getEndpoint: async (identifier: string, role: string) => {
        const endpoint = await this.ocpiEndpointRepository.findOne({
          where: { identifier, role },
        });
        if (!endpoint) {
          throw Error(`Endpoint for ${identifier} ${role} not found.`);
        }
        return endpoint.url;
      },
      saveEndpoints: async (versionDetail: IVersionDetail) => {
        await this.ocpiEndpointRepository.createAll(versionDetail.endpoints);
      },
    };
  }
}

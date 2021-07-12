import { IPluggableDB, IVersionDetail } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../schemas/auth.schema';
import { Endpoint } from '../schemas/endpoint.schema';

@Injectable()
export class OcnBridgeDbService implements IPluggableDB {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
  ) {}

  /**
   * GET TOKEN_B (our node's authentication token)
   */
  public async getTokenB() {
    const found = await this.authRepository.findOne();
    return found?.tokenB ?? '';
  }

  /**
   * SET TOKEN_B (our node's authentication token)
   */
  public async setTokenB(token: string) {
    await this.updateAuth({ tokenB: token });
  }

  /**
   * GET TOKEN_C (our authentication token)
   */
  public async getTokenC() {
    const found = await this.authRepository.findOne();
    return found?.tokenC ?? '';
  }

  /**
   * SET TOKEN_C (our authentication token)
   */
  public async setTokenC(token: string) {
    await this.updateAuth({ tokenC: token });
  }

  /**
   * GETs an individual endpoint (one of our node's)
   *
   * @param identifier module identifier, e.g. "sessions"
   * @param role module interface type, e.g. "SENDER"
   * @returns endpoint url
   */
  public async getEndpoint(identifier: string, role: string) {
    const found = await this.endpointRepository.findOne({
      identifier,
      role,
    });
    return found?.url ?? '';
  }

  /**
   *
   * @param versionDetail
   * @returns
   */
  public saveEndpoints = async (versionDetail: IVersionDetail) => {
    await this.endpointRepository.insert(versionDetail.endpoints);
    return;
  };

  private async updateAuth(update: Partial<Auth>) {
    const existent = await this.authRepository.findOne({ id: 0 });
    if (existent) {
      await this.authRepository.update({ id: 0 }, update);
    } else {
      await this.authRepository.insert(update);
    }
  }
}

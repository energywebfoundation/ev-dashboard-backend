import { Body, Controller, Get, Post } from '@nestjs/common';
import { Partner } from './schemas/partners.schema';
import { PartnersService } from './services/partners.service';
import { PartnerDto } from './types';

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get()
  public async getAllPartners(): Promise<Partner[]> {
    const { some, none } = await this.partnersService.getAll();
    if (none) {
      return [];
    }
    return some;
  }

  @Get('/msp')
  public async getMspPartners(): Promise<Partner[]> {
    const { some, none } = await this.partnersService.getMSPs();
    if (none) {
      return [];
    }
    return some;
  }

  @Get('/cpo')
  public async getCpoPartners(): Promise<Partner[]> {
    const { some, none } = await this.partnersService.getCPOs();
    if (none) {
      return [];
    }
    return some;
  }

  @Post()
  public async addPartner(@Body() body: PartnerDto) {
    const { ok, err } = await this.partnersService.addPartner(body);
    if (ok) {
      return 'OK';
    }
    return { err: err.message };
  }
}

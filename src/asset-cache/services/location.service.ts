import { ILocation } from '@energyweb/ocn-bridge';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evse, Location } from '../schemas';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Evse) private readonly evseRepository: Repository<Evse>,
  ) {}

  public async createOrUpdate(location: ILocation) {
    const savedLocation = await this.locationRepository.findOne({
      id: location.id,
    });
    if (savedLocation) {
      await this.locationRepository.update(
        { _id: savedLocation._id },
        location,
      );
    } else {
      await this.locationRepository.insert(location);
    }
    // TODO: separate location/evses
  }
}

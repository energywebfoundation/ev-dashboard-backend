import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../schemas';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  public async createOrUpdate(vehicle: Partial<Vehicle>) {
    const saved = await this.vehicleRepository.findOne({ uid: vehicle.uid });
    if (saved) {
      console.log('updating vehicle');
      await this.vehicleRepository.update({ _id: saved._id }, vehicle);
    } else {
      console.log('creating new vehicle');
      await this.vehicleRepository.insert(vehicle);
    }
  }

  public async findOne(uid: string) {
    return await this.vehicleRepository.findOne({ uid });
  }
}

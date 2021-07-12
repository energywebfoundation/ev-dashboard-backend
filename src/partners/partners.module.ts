import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersController } from './partners.controller';
import { Partner } from './schemas/partners.schema';
import { PartnersService } from './services/partners.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  controllers: [PartnersController],
  exports: [PartnersService],
  providers: [PartnersService],
})
export class PartnersModule {}

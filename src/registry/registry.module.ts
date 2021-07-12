import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegistryService } from './services/registry.service';

@Module({
  imports: [ConfigModule],
  exports: [RegistryService],
  providers: [RegistryService],
})
export class RegistryModule {}

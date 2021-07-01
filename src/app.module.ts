import { Module } from '@nestjs/common';
import { OcnBridgeModule } from './ocn-bridge/ocn-bridge.module';
import { OcnBridge } from './ocn-bridge/ocn-bridge';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [OcnBridgeModule, ConfigModule.forRoot(), ScheduleModule.forRoot()],
  providers: [OcnBridge],
})
export class AppModule {}

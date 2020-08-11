import {ApplicationConfig} from '@loopback/core';
import {PartialOcnConfig} from './ocn-config.interface';

export interface EWFlexApplicationConfig extends ApplicationConfig {
  ocn?: PartialOcnConfig;
}

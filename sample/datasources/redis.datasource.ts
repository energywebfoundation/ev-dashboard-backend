import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './redis.datasource.config.json';

interface RedisConfig {
  name: string,
  connector: string,
  host: string,
  port: number
}

@lifeCycleObserver('datasource')
export class RedisDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'redis';

  constructor(
    @inject('datasources.config.redis', {optional: true})
    dsConfig: RedisConfig = config,
  ) {
    if (process.env.REDIS_HOST) {
      dsConfig.host = process.env.REDIS_HOST
    }
    if (process.env.REDIS_PORT) {
      dsConfig.port = Number(process.env.REDIS_PORT)
    }
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

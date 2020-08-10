import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './pgsql.datasource.config.json';

interface PgsqlConfig {
  name: string;
  connector: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@lifeCycleObserver('datasource')
export class PgsqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'pgsql';

  constructor(
    @inject('datasources.config.pgsql', {optional: true})
    dsConfig: PgsqlConfig = config,
  ) {
    // overwrite the default config from the environment
    if (process.env.PGSQL_HOST) {
      dsConfig.host = process.env.PGSQL_HOST;
    }
    if (process.env.PGSQL_PORT) {
      dsConfig.port = Number(process.env.PGSQL_PORT);
    }
    if (process.env.PGSQL_USER) {
      dsConfig.user = process.env.PGSQL_USER;
    }
    if (process.env.PGSQL_PASSWORD) {
      dsConfig.password = process.env.PGSQL_PASSWORD;
    }
    if (process.env.PGSQL_DATABASE) {
      dsConfig.database = process.env.PGSQL_DATABASE;
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

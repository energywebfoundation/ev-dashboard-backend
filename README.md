# Energy Web Flex: Backend

<short about text>

This repository is an entrypoint to the different components that are part of the Flex suite:

This backend is serving the [flex-frontend](https://github.com/energywebfoundation/flex-frontend).

## Maintainers
**Primary**: Mani Hagh Sefat (@manihagh)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
NodeJS v10
NPM v6+
```

## DB configuration

Currently 3 type of db configuration is provided
1. In-memory (default)
    - configure file are located at src/datasources/memory.datasource.ts
2. Postgres
    - configure file are located at sample/datasources/pgsql.datasource.ts && sample/datasources/pgsql.datasource.config.json
        copy both files to src/datasources/
3. Redis
    - configure file are located at sample/datasources/redis.datasource.ts && sample/datasources/redis.datasource.config.json
        copy both files to src/datasources/

All types of datasource providers require initial data to be setup
1. In-memory (default)
    - initial file are located at inMemoryDB_EWFlex.json
2. Postgres
    - initial file are located at ew-flex.sql
3. Redis
    - initial file are located at redis-based-data.txt

Please import this initial data in respective db source (MemoryDataSource, RedisDataSource, PgsqlDataSource).

Main step to update repository file located in src/repositories with correct datasource 

example :

 constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('OfferRepository') protected offerRepositoryGetter: Getter<OfferRepository>,
  ) {
    super(ActivationSummary, dataSource);
    this.offer = this.createBelongsToAccessorFor('offer', offerRepositoryGetter,);
    this.registerInclusionResolver('offer', this.offer.inclusionResolver);
  }

Available db source
    - @inject('datasources.memory') dataSource: MemoryDataSource
    - @inject('datasources.pgsql') dataSource: PgsqlDataSource
    - @inject('datasources.redis') dataSource: RedisDataSource

## How to Run

Run `npm i` to install dependencies.

Run `npm run build` to build the project.

Run `npm run start` to start your server.

Open your browser and navigate to  `http://localhost:8080/`.

## Docker

Docker compose is used for the development environment only. Installing dependencies, watchting for changes and rebuiling the app is taken care of.

Copy `.env.template` to `.env` and set UID and GID accoring to your host system.

Then execute: `docker-compose up --build`

End with an example of getting some data out of the system or using it for a little demo

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details

## FAQ

Frequently asked questions and their answers will be collected here.

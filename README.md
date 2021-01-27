# Energy Web Flex: Backend

<short about text>

This repository is the backend for the [EV Dashboard Frontend](https://github.com/energywebfoudnation/ev-dashboard-frontend).

This backend is based on the [flex-backend](https://github.com/energywebfoundation/flex-backend).

## Maintainers
- **Primary**: Adam S. (@adamstaveley), John H. (@jrhender)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing
purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- NodeJS (at least 12 LTS)
- Docker and docker-compose

## Running

See the [PoC repo](https://github.com/energywebfoundation/elia-poc) for docker instructions.

## DB configuration

We use the "in memory" database for now (which is actually persisted in a JSON file). DB configuration is manual,
requiring modifying the source and therefore needs to be made runtime-configurable. See the
[Flex backend readme](https://github.com/energywebfoundation/flex-backend) for more on this.

## Open Charging Network (OCN) configuration

The backend needs to be enable its OCN interface. This allows it to
receive data relating to EVs, EVSEs and charging sessions.

TO enable this, set the env var `OCN_ENABLED=true`.

The application config should implement the `EWFlexApplicationConfig` interface.
All OCN values are required if `ocn.enabled` is set to `true`. See `./index.js` for the expected env vars.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of
conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for
details

## FAQ

Frequently asked questions and their answers will be collected here.

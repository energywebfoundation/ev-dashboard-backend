import * as Joi from 'joi';

export default () =>
  Joi.object({
    LOG_LEVEL: Joi.string().default('info'),
    /**
     * OCN BRIDGE ENV VARS
     */
    OCN_BRIDGE_PORT: Joi.number().default(8090),
    OCN_BRIDGE_URL: Joi.string().default('http://localhost:8090'),
    OCN_BRIDGE_NODE_URL: Joi.string().default('http://localhost:8080'),
    OCN_BRIDGE_COUNTRY_CODE: Joi.string().default('DE'),
    OCN_BRIDGE_PARTY_ID: Joi.string().default('EVD'),
    OCN_BRIDGE_ROLE: Joi.string().default('OTHER'),
    OCN_BRIDGE_NAME: Joi.string().default('EV Dashboard'),
    OCN_BRIDGE_NETWORK: Joi.string().default('volta'),
    OCN_BRIDGE_LOG: Joi.boolean().default(true),
    OCN_BRIDGE_DRY_RUN: Joi.boolean().default(false),
    OCN_BRIDGE_SIGNATURES: Joi.boolean().default(true),
    OCN_BRIDGE_SIGNER: Joi.string()
      .regex(/(0x)?([0-9a-fA-f]{64})/i)
      .required(),
    OCN_BRIDGE_TOKEN_A: Joi.string().required(),
    OCN_BRIDGE_PERMISSIONS: Joi.string().required(),
    /**
     * EV REGISTRY
     */
    EV_REGISTRY_PROVIDER: Joi.string().default(
      'https://volta-internal-archive.energyweb.org/',
    ),
    EV_REGISTRY_ADDRESS: Joi.string().default(
      '0x8d80504617eB17816b91610Fb2a0274Dc70f193f',
    ),
  });

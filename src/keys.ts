export const WEB3_PROVIDER = 'providers.web3';
export const MERKLE_ROOT_CONTRACT_PROVIDER = 'providers.merklerootcontract';
export const MERKLE_ROOT_SERVICE_PROVIDER = 'services.merklerootservice';
export const ASSET_ACTIVATION_SERVICE = 'services.assetactivationservice';

export const OCN_CONFIG = 'config.ocn';
export const OCN_BRIDGE_API_PROVIDER = 'providers.ocnBridgeApiProvider';
export const OCN_BRIDGE_DB_PROVIDER = 'providers.ocnBridgeDbProvider';
export const OCPI_LOCATION_REPOSITORY = 'repositories.ocpiLocationRepository';
export const OCPI_TOKEN_REPOSITORY = 'repositories.ocpiTokenRepository';
export const OCN_CACHE_METADATA_REPOSITORY = 'repositories.ocnCacheMetadataRepository';
export const OCN_ASSET_METADATA_REPOSITORY = 'repositories.ocnAssetMetadataRepository';
export const EV_REGISTRY_CONTRACT_PROVIDER = 'providers.evregistrycontract';
export const REGISTRY_SERVICE_PROVIDER = 'providers.registryservice';

export const enum OFFER_STATE {
  PENDING = 1,
  PENDING_CONFIRM = 2,
  PENDING_SUBMIT = 3,
  PENDING_ACTIVATION = 4,
  CONFIRM = 5,
  RESERVED = 6,
  ACTIVATION = 7,
}

export const enum BUNDLE_STATE {
  REJECTED = 1,
  RESERVED = 2,
  ACCEPTED = 3,
}

export const enum OFFER_TYPE {
  SUPPLY = 1,
  DEMAND = 2,
}

export const enum CLAIM_TYPE {
  OWNER = 1,
  ASSET = 2,
  INSTALLATION = 3,
}

export const enum CONSTRAINTS {
  'a9c30590-93cb-4e0b-bf0b-e59fdb96110b' = 'a9c30590-93cb-4e0b-bf0b-e59fdb96110b',
  'c80b9a03-7009-40ef-987d-c7058b60c844' = 'c80b9a03-7009-40ef-987d-c7058b60c844',
  '2a39f69e-ddab-42d3-b37b-87ac52ef15a1' = '2a39f69e-ddab-42d3-b37b-87ac52ef15a1',
  '60a11da9-20b8-47bc-b365-a49d98277d05' = '60a11da9-20b8-47bc-b365-a49d98277d05',
}

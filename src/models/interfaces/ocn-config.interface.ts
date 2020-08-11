export interface PartialOcnConfig {
  enabled: boolean;
  stage?: string;
  bridgeURL?: string;
  identity?: string;
  nodeURL?: string;
  tokenA?: string;
}

export interface OcnConfig {
  stage: string;
  bridgeURL: string;
  identity: string;
  nodeURL: string;
  tokenA: string;
}

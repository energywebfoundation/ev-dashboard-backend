export const parseBool = (boolLike: string): boolean =>
  boolLike === 'true' || boolLike === 'yes' ? true : false;

export type Result<T = boolean, E = Error> = {
  ok?: T;
  err?: E;
};

export type Option<T> = {
  some?: T;
  none?: boolean;
};

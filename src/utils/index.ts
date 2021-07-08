export const parseBool = (boolLike: string): boolean =>
  boolLike === 'true' || boolLike === 'yes' ? true : false;

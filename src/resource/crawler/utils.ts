import { pipe, keys, head, split, filter, join, trim } from 'rambda';
import { ObjPred, pickBy } from 'ramda';

export const parseLabel = (raw: string) => raw.slice(1, -1);

export function findBy<T>(pred: ObjPred<T>) {
  return pipe(pickBy(pred), keys, head);
}

export const trimAll = pipe(
  trim,
  split(''),
  filter<string>((str) => str !== ' '),
  join(''),
);

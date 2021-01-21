import { pipe, keys, head, split, join, trim } from 'rambda';
import { ObjPred, pickBy } from 'ramda';

export const parseLabel = (raw: string) => raw.slice(1, -1);

export function findBy<T>(pred: ObjPred<T>) {
  return pipe(pickBy(pred), keys, head);
}

export const trimAll = pipe(trim, split(' '), join(''));

const titleLabelRegex = /\[([\s\w\-/\.@()~]|[^\x00-\xff])+\]/g;

export const matchTitleLabel = (rawTitle: string) =>
  rawTitle.match(titleLabelRegex).map((label) => parseLabel(label));

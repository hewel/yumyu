import * as cheerio from 'cheerio';
import urlcat from 'urlcat';
import { pipe, fromPairs, map, test, groupBy, merge } from 'rambda';
import {
  Labelname,
  TitleLabelname,
  labelnameHashmap,
  titleLabelnameHashmaps,
} from './hashmap';
import request, { PREFIXURL } from './request';
import { parseLabel, findBy, trimAll, matchTitleLabel } from './utils';

async function getList() {
  const { body } = await request.get('forum-index-fid-950-page-1.htm');
  const $ = cheerio.load(body);

  const labelListDom = $('#threadtype').children();

  const allLabelList = pipe(
    map((el) => {
      const $el = $(el);
      const labelnameText = $el
        .find('td')
        .first()
        .find('span')
        .text()
        .slice(0, -1);

      const labelname = findBy<string>((labelname: string) =>
        labelnameText.includes(labelname),
      )(labelnameHashmap);

      const labelItems = $el
        .find('td')
        .last()
        .find('a')
        .toArray()
        .map((el) => $(el).text().trim())
        .slice(1);

      return [labelname, labelItems];
    }),
    fromPairs,
  )(labelListDom.toArray()) as Record<Labelname, string[]>;

  const listDoms = $('#threadlist .bg2').nextAll('table');

  const groupLabels = pipe<
    readonly string[],
    readonly string[][],
    Partial<Record<Labelname, string>>
  >(
    map<string, string[]>((text) => {
      const key = findBy<string[]>((list: string[]) => list.includes(text))(
        allLabelList,
      );
      return [key, trimAll(text)];
    }),
    fromPairs,
  );

  const groupTitleLabels = pipe(
    groupBy((label: string) => {
      const key =
        titleLabelnameHashmaps.find(({ match }) => test(match, label))?.key ||
        'title';
      return key;
    }),
    map<string[], string, never>((labels) =>
      labels.length > 0 ? labels.join(' ') : labels[0],
    ),
  );

  const posts = listDoms.toArray().map((el) => {
    const $el = $(el);
    const titleEl = $el.find('.subject_link');
    const rawtitle = titleEl.text().trim();
    const link = titleEl.attr('href');

    const labelTexts = $el
      .find('.subject_type')
      .toArray()
      .map((el) => parseLabel($(el).text().trim()));

    const labels = groupLabels(labelTexts);
    const titleLabels = groupTitleLabels(matchTitleLabel(rawtitle)) as Partial<
      Record<TitleLabelname | 'title', string>
    >;
    const allLabels = merge(labels, titleLabels);

    return {
      rawtitle,
      link,
      source: urlcat(PREFIXURL, link),
      ...allLabels,
    };
  });
  return posts;
}

export { getList };

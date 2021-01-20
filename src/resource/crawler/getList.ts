import * as cheerio from 'cheerio';
import urlcat from 'urlcat';
import { pipe, fromPairs, map, dropWhile, isEmpty } from 'rambda';
import request, { PREFIXURL } from './request';
import { parseLabel, findBy, trimAll } from './utils';

type Labelname =
  | 'releaseYear'
  | 'genre'
  | 'status'
  | 'format'
  | 'region'
  | 'watermark';

const labelnameHashmap: Record<Labelname, string> = {
  releaseYear: '时间',
  genre: '类型',
  status: '状态',
  format: '格式',
  region: '地区',
  watermark: '水印',
};

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
    {
      [key: string]: string;
    }
  >(
    map<string, string[]>((text) => {
      const key = findBy<string[]>((list: string[]) => list.includes(text))(
        allLabelList,
      );
      return [key, trimAll(text)];
    }),
    fromPairs,
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

    const labels = groupLabels(labelTexts) as Partial<
      Record<Labelname, string>
    >;

    return {
      rawtitle,
      link,
      source: urlcat(PREFIXURL, link),
      ...labels,
    };
  });
  return posts;
}

export { getList };

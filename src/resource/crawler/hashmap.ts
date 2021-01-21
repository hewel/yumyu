export type Labelname =
  | 'releaseYear'
  | 'genre'
  | 'status'
  | 'format'
  | 'region'
  | 'watermark';

export const labelnameHashmap: Record<Labelname, string> = {
  releaseYear: '时间',
  genre: '类型',
  status: '状态',
  format: '格式',
  region: '地区',
  watermark: '水印',
};
export type downloadType = 'torrent' | 'cloudDrive';

export const downloadTypeHashmap: Record<downloadType, string> = {
  torrent: 'bt',
  cloudDrive: '网盘',
};

export type TitleLabelname =
  | 'downloadType'
  | 'language'
  | 'status'
  | 'format'
  | 'resolution';

export type TitleLabelnameHashmap = {
  key: TitleLabelname;
  match: RegExp;
};

export const titleLabelnameHashmaps: TitleLabelnameHashmap[] = [
  { key: 'downloadType', match: /(BT)|(网盘)/ },
  { key: 'format', match: /(MP4)|(MKV)/ },
  { key: 'language', match: /语|字/ },
  { key: 'resolution', match: /\d+[KP]/ },
  { key: 'status', match: /(更[新|至])|集/ },
];

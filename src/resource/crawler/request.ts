import got from 'got';

export const PREFIXURL = 'https://www.btbtt.us';

const request = got.extend({
  prefixUrl: PREFIXURL,
});
export default request;

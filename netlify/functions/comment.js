const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');

const app = Waline({
  env: 'netlify',
  async postSave(comment) {
    // do what ever you want after save comment
  },
});

const fn = serverless(http.createServer(app));
const PREFIX = '/.netlify/functions/comment';

module.exports.handler = async (event, context) => {
  // Functions v2: event 是 Web API Request 对象
  if (event && typeof event.url === 'string' && !event.httpMethod) {
    const headers = {};
    event.headers.forEach((v, k) => { headers[k] = v; });
    let body = null;
    if (event.method !== 'GET' && event.method !== 'HEAD') body = await event.text();
    const u = new URL(event.url);
    const v1 = {
      // 保留完整路径:thinkjs 的 router prefix 和 /ui dashboard 中间件都按带
      // /.netlify/functions/comment 前缀的 url 匹配,剥前缀会让 /ui 404
      path: u.pathname,
      rawUrl: u.pathname + u.search,
      httpMethod: event.method,
      headers,
      queryStringParameters: Object.fromEntries(u.searchParams),
      body,
      isBase64Encoded: false,
    };
    return fn(v1, context);
  }
  // Functions v1: event.path 已带 /.netlify/functions/comment 前缀,直接透传
  return fn(event, context);
};

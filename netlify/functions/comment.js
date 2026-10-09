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
    const u = new URL(event.url);
    const innerPath = u.pathname.startsWith(PREFIX) ? u.pathname.slice(PREFIX.length) || '/' : u.pathname;
    const headers = {};
    event.headers.forEach((v, k) => { headers[k] = v; });
    let body = null;
    if (event.method !== 'GET' && event.method !== 'HEAD') body = await event.text();
    const v1 = {
      path: innerPath,
      rawUrl: innerPath + u.search,
      httpMethod: event.method,
      headers,
      queryStringParameters: Object.fromEntries(u.searchParams),
      body,
      isBase64Encoded: false,
    };
    return fn(v1, context);
  }
  // Functions v1: event.path 带前缀(Netlify 实测就是这个形状)
  if (event?.path?.startsWith(PREFIX)) {
    event.path = event.path.slice(PREFIX.length) || '/';
  }
  if (event?.rawUrl?.startsWith(PREFIX)) {
    event.rawUrl = event.rawUrl.slice(PREFIX.length) || '/';
  }
  return fn(event, context);
};

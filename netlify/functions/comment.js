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
  if (event.path && event.path.startsWith(PREFIX)) {
    event.path = event.path.slice(PREFIX.length) || '/';
  }
  if (event.rawUrl && event.rawUrl.startsWith(PREFIX)) {
    event.rawUrl = event.rawUrl.slice(PREFIX.length) || '/';
  }
  return fn(event, context);
};

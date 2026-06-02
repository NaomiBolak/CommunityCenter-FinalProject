const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_API_PROXY_TARGET || 'http://127.0.0.1:5051';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: 'warn',
      timeout: 15000,
      proxyTimeout: 15000,
      onError(err, req, res) {
        console.warn('[proxy]', req.method, req.url, '→', target, err.code || err.message);
        if (!res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              title: 'API unavailable',
              detail: `Cannot reach ${target}. Start CommunityCenter.API (http://127.0.0.1:5051) then refresh.`,
            })
          );
        }
      },
    })
  );
};
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_HOST,
      changeOrigin: true,
      router:{
        'localhost:8001/api' : process.env.REACT_APP_PROXY_HOST,  // host only
        '*':''
      }
    })
  );
};

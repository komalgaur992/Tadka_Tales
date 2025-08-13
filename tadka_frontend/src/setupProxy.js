const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      // Preserve cookies for auth endpoints
      cookieDomainRewrite: 'localhost',
      secure: false,
      logLevel: 'silent',
    })
  )
  // Optional: proxy media files served by Django
  app.use(
    '/media',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      secure: false,
      logLevel: 'silent',
    })
  )
}

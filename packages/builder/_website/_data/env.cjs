module.exports = function() {
  return {
    STRAPI_BACKEND_URL: (process.env.ELEVENTY_RUN_MODE === 'serve') ? 'http://localhost:1337' : 'https://portal.futureporn.net',
    ELEVENTY_RUN_MODE: process.env.ELEVENTY_RUN_MODE
  }
};
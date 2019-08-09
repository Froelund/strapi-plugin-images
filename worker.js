global.STRAPI_IMAGES_WORKER = true;

(async () => {
  const strapi = require('strapi');
  // Load the app.
  await strapi.load();
  // Run bootstrap function.
  await strapi.bootstrap();
  // Freeze object.
  await strapi.freeze();
})();

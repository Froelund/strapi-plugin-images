const {
  IMAGES_PLUGIN
} = require('../../Constants');

module.exports = async cb => {
  const workerStrategyEnabled = strapi.plugins[IMAGES_PLUGIN].config.processing.worker;
  const processing = !workerStrategyEnabled || !!global.STRAPI_IMAGES_WORKER;
  strapi.plugins[IMAGES_PLUGIN].services.images.init(strapi, processing);
  cb();
};
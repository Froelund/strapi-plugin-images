const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  UPLOAD_PLUGIN
} = require('../Constants');

module.exports = {
  cacheKey: (uploadId, ext, query) => `_thumbnail_${uploadId}_${query.width}x${query.height}_${query.mode}${ext}`,
  get: async (cacheKey) => {
    const cacheKeyResults = await strapi.plugins[UPLOAD_PLUGIN].services.upload.fetchAll({
      name: cacheKey,
    });
    return _.first(cacheKeyResults);
  },
  save: async (cacheKey, filePath, mime) => {
    const uploadConfig = {
      path: filePath,
      name: cacheKey,
      type: mime,
    };

    const config = await strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: UPLOAD_PLUGIN
    }).get({ key: 'provider' });

    if (config.enabled === false) {
      strapi.log.error('File upload is disabled');
      throw new Error('Could not upload cached image: Upload provider not enabled');
    }

    const fileBuffers = await strapi.plugins[UPLOAD_PLUGIN].services.upload.bufferize([uploadConfig]);
    await strapi.plugins.upload.services.upload.upload(fileBuffers, config);
    return module.exports.get(cacheKey);
  }
};
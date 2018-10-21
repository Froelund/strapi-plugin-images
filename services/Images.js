'use strict';
const Jimp = require('jimp');
const path = require('path');
const _ = require('lodash');
/**
 * Images.js service
 *
 * @description: 
 */
const SUPPORTED_MIMES = [Jimp.MIME_PNG, Jimp.MIME_TIFF, Jimp.MIME_JPEG, Jimp.MIME_BMP, Jimp.MIME_X_MS_BMP, Jimp.MIME_GIF];
module.exports = {
  SUPPORTED_MIMES,
  supportedMime: (mime) => _.isString(mime) && _.includes(SUPPORTED_MIMES, mime),
  read: async (entity) => {
    const {
      provider,
      url,
    } = entity;
    if (provider == 'local') {
      const filePath = path.join(strapi.config.appPath, 'public', url);
      return Jimp.read(filePath);
    } else {
      return Jimp.read(url);
    }
  },
  process: async (image, options) => {
    const {
      size,
      mode = 'cover'
    } = options;
    if (size) {
      const [width, height] = size.split('x').map((dimString) => parseInt(dimString));
      switch (mode) {
        case 'contain':
          await image.contain(width, height);
          break;
        case 'cover':
          await image.cover(width, height);
          break;
      }
    }
  },
  getBuffer: async (image, mime) => {
    return new Promise((resolve, reject) => {
      image.getBuffer(mime, (err, buffer) => {
        if (err) return reject(err);
        return resolve(buffer);
      });
    });
  }
};

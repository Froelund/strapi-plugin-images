'use strict';
const _ = require('lodash');
const Queue = require('bull');

const {
  IMAGES_PLUGIN
} = require('../Constants');

/**
 * Images.js service
 *
 * @description: 
 */
class ImageNotFound extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'ImageNotFound';
    Error.captureStackTrace(this, ImageNotFound);
  }
}

function ImagesService() {
  
}
// jpeg, png, webp, gif, svg
ImagesService.SUPPORTED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'].map((mime) => mime.toLowerCase());

ImagesService.prototype.init = function(strapi, processingEnabled) {
  this.uploadService = strapi.plugins['upload'].services.upload;
  this.imageCache = strapi.plugins[IMAGES_PLUGIN].services.imagecache;
  this.imageProcessing = strapi.plugins[IMAGES_PLUGIN].services.imageprocessing;
  this.rootURL = process.env.ROOT_URL || 'http://localhost:1337';
  this.queue = new Queue(strapi.plugins[IMAGES_PLUGIN].config.processing.queue, {
    createClient: strapi.plugins[IMAGES_PLUGIN].services.redisconnection,
  });
  if (processingEnabled) {
    console.log('Starting processing');
    this.startProcessing();
  }
};

ImagesService.prototype.startProcessing = function() {
  this.queue.process(1, this._processCachedImage.bind(this));
};

ImagesService.prototype.supported = function(mime) {
  if (!_.isString(mime)) return false;
  return ImagesService.SUPPORTED_MIME.indexOf(mime.toLowerCase());
};

ImagesService.prototype.resizeURL = function(image) {
  if (!image || !image.mime || !image._id) return;
  if (this.supported(image.mime)) {
    return `${this.rootURL}/images/${image._id}`;
  }
};

ImagesService.prototype.fetch = async function(params, query) {
  const originalImage = await this.uploadService.fetch(params);
  if (!originalImage) throw new ImageNotFound(`Could not find image with params: ${params}`);
  const cacheKey = this.imageCache.cacheKey(originalImage._id, originalImage.ext, query);
  let cachedImage = await this.imageCache.get(cacheKey);
  if (!cachedImage) {
    const url = originalImage.url.startsWith('/') ? `${this.rootURL}${originalImage.url}` : originalImage.url;
    const job = await this.queue.add({ url, query, cacheKey, mime: originalImage.mime });
    cachedImage = await job.finished();
  }
  return cachedImage;
};

ImagesService.prototype._processCachedImage = async function(job) {
  const {
    url,
    query,
    cacheKey,
    mime,
  } = job.data;
  const processedImage = await this.imageProcessing.process(url, query.width, query.height, query.mode);
  return this.imageCache.save(cacheKey, processedImage, mime);
};

module.exports = new ImagesService();
module.exports.ImageNotFound = ImageNotFound;
'use strict';

const _ = require('lodash');

const {
  IMAGES_PLUGIN
} = require('../Constants');

/**
 * Images.js controller
 *
 * @description: A set of functions called "actions" of the `images` plugin.
 */

module.exports = {

  /**
   * Get and process an image
   *
   * @return {Object}
   */

  get: async (ctx) => {
    const ImagesService = strapi.plugins[IMAGES_PLUGIN].services.images;
    let {
      width,
      height,
      size,
      mode,
    } = ctx.query;

    if (_.isString(size)) {
      const sizes = size.toLowerCase().split('x');
      if (_.size(sizes) == 2) {
        width = sizes[0];
        height = sizes[1];
      }
    }

    width = parseInt(width);
    height = parseInt(height);
    
    if (!_.isNumber(width)) return ctx.badRequest('Width is not a number');
    if (!_.isNumber(height)) return ctx.badRequest('Height is not a number');
    
    try {
      const image = await ImagesService.fetch(ctx.params, { width, height, mode });
      if (!image) return ctx.notFound(); // Upload was not found
      ctx.status = 307;
      return ctx.redirect(image.url);
    } catch (error) {
      if (error instanceof ImagesService.ImageNotFound) {
        strapi.log.info('Image not found', ctx.params);
        return ctx.notFound('Image not found');
      } else if (error.name == 'CastError') {
        strapi.log.info('Invalid attachment ID', ctx.params);
        return ctx.badRequest('Invalid attachment ID');
      }
      ctx.throw(error);
    }
  }
};

'use strict';
const _ = require('lodash');

module.exports = strapi => ({
  initialize: (cb) => {
    const ImagesService = strapi.plugins['images'].services.images;
    strapi.app.use(async (ctx, next) => {
      await next();
      if (ctx.get('Content-Type') != 'application/json' || !ctx.body) return;
      const responseBody = JSON.parse(JSON.stringify(ctx.body));
      const attachments = _.pickBy(responseBody, (val, ) => {
        return _.has(val, 'mime');
      });
      if (_.size(attachments) < 1) return;
      const attachmentKeys = _.keys(attachments);
      _.forEach(attachmentKeys, (key) => {
        if ( ImagesService.supportedMime(_.get(responseBody, [key, 'mime']))) {
          const resizeRoute = '/images/' + _.get(responseBody, [key, '_id']);
          _.set(responseBody, [key, 'resize_url'], resizeRoute);
        } else {
          _.set(responseBody, [key, 'resize_url'], null);
        }
      });
      ctx.body = responseBody;
    });
    cb();
  }
});
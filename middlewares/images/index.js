'use strict';
const _ = require('lodash');

const {
  IMAGES_PLUGIN
} = require('../../Constants');

function extractAttachmentKeys(jsonBody) {
  const recursiveMap = (value, key) => {
    if (_.isArray(value)) {
      return _.map(value, recursiveMap).map((keyIndex) => [key, keyIndex].join(','));
    } else {
      if (_.has(value, 'mime')) return key;
    }
  };

  return _(jsonBody)
    .mapValues(recursiveMap)
    .filter((imageKey) => !!imageKey)
    .flatten()
    .value();
}

module.exports = strapi => ({
  initialize: (cb) => {
    const ImagesService = strapi.plugins[IMAGES_PLUGIN].services.images;
    strapi.app.use(async (ctx, next) => {
      await next();
      if (ctx.get('Content-Type') != 'application/json' || !ctx.body) return;
      const responseBody = JSON.parse(JSON.stringify(ctx.body));
      const attachmentKeys = extractAttachmentKeys(responseBody);
      if (_.size(attachmentKeys) < 1) return;
      _.forEach(attachmentKeys, (key) => {
        const objectPath = key.split(',');
        const attachment = _.get(responseBody, objectPath);
        if ( ImagesService.supported(_.get(attachment, ['mime']))) {
          const resizeRoute = ImagesService.resizeURL(_.get(attachment, ['_id']));
          _.set(responseBody, [...objectPath, 'resize_url'], resizeRoute);
        } else {
          _.set(responseBody, [...objectPath, 'resize_url'], null);
        }
      });
      ctx.body = responseBody;
    });
    cb();
  }
});
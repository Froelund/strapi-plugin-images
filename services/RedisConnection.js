const {
  IMAGES_PLUGIN
} = require('../Constants');

function createClient(type) {
  console.log(`connections ${type}`, Object.keys(strapi.connections));
  const requestedRedisConnectionName = strapi.plugins[IMAGES_PLUGIN].config.redis[type];
  const requestedRedisConnection = strapi.connections[requestedRedisConnectionName];
  if (requestedRedisConnection) {
    return requestedRedisConnection;
  } else {
    const defaultRedisConnectionName = strapi.plugins[IMAGES_PLUGIN].config.redis.default || 'bull-client';
    const defaultRedisConnection = strapi.connections[defaultRedisConnectionName];
    if (!defaultRedisConnection) {
      strapi.log.error(`Could not location default redis-connection for bull. Type requested ${type}. Corresponding connection: ${defaultRedisConnectionName} `);
      throw new Error(`Redis connection ${defaultRedisConnectionName} is not configured`);
    }
    return defaultRedisConnection;
  }
}

module.exports = createClient;
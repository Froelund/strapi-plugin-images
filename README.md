# Strapi images plugin

Images plugin was made because I needed to fetch image-uploads in an exact size, determined by the client.

## Installation

Due to a limitation in strapis installation script, you will have to install this plugin manually.

In the root of your project, run the following:
```
npm install strapi-plugin-images --no-save
```
*This will install the plugin node `node_modules` folder*

```
mv node_modules/strapi-plugin-images plugins/images
```
*In order for strapi to use this plugin, it has to be moved to the folder `plugins`*

```
cp node_modules/strapi-generate-plugin/templates/gitignore plugins/images/.gitignore
```
*To keep a clean project, you'll need the `.gitignore` plugin template from strapi*

## Setup required redis connections

This plugin has the ability to processes image manipulations seperate from the main strapi process. This is managed using the ever stable task manager [Bull](https://www.npmjs.com/package/bull), which requires redis.

Three connections is being used: `client`, `subscriber` and `bclient`.

Add these three connections to each environment as follows:
```
"bull-client": {
  "connector": "strapi-hook-redis",
  "settings": {
    "port": 6379,
    "host": "127.0.0.1",
    "password": ""
  },
  "options": {
    "debug": false
  }
},
"bull-subscriber": {
  "connector": "strapi-hook-redis",
  "settings": {
    "port": 6379,
    "host": "127.0.0.1",
    "password": ""
  },
  "options": {
    "debug": false
  }
},
"bull-bclient": {
  "connector": "strapi-hook-redis",
  "settings": {
    "port": 6379,
    "host": "127.0.0.1",
    "password": ""
  },
  "options": {
    "debug": false
  }
}
```
Ofcourse your connection settings might differ. Check the [documentation for strapi connections](https://strapi.io/documentation/3.x.x/configurations/configurations.html#database)

## Ofloading image processing to worker-process

First you should change the configuration to be using a worker-process.

Go to `plugins/images/config/images.json` and change the `processing.worker` to `true`. Like this:
```
{
  "rootURL": "${process.env.ROOT_URL || 'http://localhost:1337'}",
  "processing": {
    "worker": true,
    "queue": "image_processing"
  },
  "redis": {
    "client": "bull-client",
    "subscriber": "bull-subscriber",
    "bclient": "bull-bclient"
  }
}
```

Now the main strapi process will not be processing images, this should be handled by the worker.

You need to start the worker along-side of the strapi process.

For example, on heroku your `Procfile` would look as the this:
```
web: npm start
worker: node plugins/images/worker.js
```

## Configuration

When plugin has been installed, you need to allow access to the `GET: images` endpoint.

1. Navigate to Users & Permissions.
2. Pick the role you would like to give permission.
3. Scroll down to the section **Images**.
4. Check the `get` endpoint, and press save.

## Usage

When the plugin is installed, it will add a `resize_url` field to each attachment in the response. When the attachment is of a supported mime-type, the field will contain a url for the resizing endpoint.

### Resizing endpoint

This endpoint can be called with some transformation parameters.

Examples:

```HOST_NAME/images/${image_id}?width=120&height=120```
This example will resize the image to 120px by 120px. It will by default use the "cover" mode.

```HOST_NAME/images/${image_id}?width=120&height=120&mode=contain```
This example will resize the image to 120px by 120px. This is explicitly configured to use the contain mode.

## Credits

This plugin is using [Sharp](https://www.npmjs.com/package/sharp) and [Bull](https://www.npmjs.com/package/bull) for task management.

Checkout the docs.

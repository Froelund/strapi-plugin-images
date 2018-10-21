# Strapi images plugin

Images plugin was made because I needed to fetch image-uploads in an exact size, determined by the client.

## Usage

When the plugin is installed, it will add a `resize_url` field to each attachment in the response. When the attachment is of a supported mime-type, the field will contain a url for the resizing endpoint.

### Resizing endpoint

This endpoint can be called with some manipulation parameters.

Examples:

```HOST_NAME/images/${image_id}?size=120x120```
This example will resize the image to 120px by 120px. It will by default use the "cover" mode.

```HOST_NAME/images/${image_id}?size=120x120&mode=contain```
This example will resize the image to 120px by 120px. This is explicitly configured to use the contain mode.

## Credits

This plugin is basically a strapi implementation of [Jimp](https://github.com/oliver-moran/jimp)

Checkout the docs.
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

```HOST_NAME/images/${image_id}?size=120x120```
This example will resize the image to 120px by 120px. It will by default use the "cover" mode.

```HOST_NAME/images/${image_id}?size=120x120&mode=contain```
This example will resize the image to 120px by 120px. This is explicitly configured to use the contain mode.

## Credits

This plugin is basically a strapi implementation of [Jimp](https://github.com/oliver-moran/jimp)

Checkout the docs.

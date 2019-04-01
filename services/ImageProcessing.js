const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

function ImageProcessing() {

}

ImageProcessing.prototype._tmpPath = function() {
  const tmpFileName = Math.random().toString(36).substr(2);
  return path.join(os.tmpdir(), tmpFileName);
};

ImageProcessing.prototype.fetch = async function(url) {
  const tmpPath = this._tmpPath();
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  response.data.pipe(fs.createWriteStream(tmpPath));
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve(tmpPath);
    });

    response.data.on('error', () => {
      reject();
    });
  });
};

ImageProcessing.prototype.process = async function(url, width, height, mode) {
  const imagePath = await this.fetch(url);
  const processedImagePath = this._tmpPath();
  await sharp(imagePath)
    .resize(width, height, {
      fit: mode,
    })
    .toFile(processedImagePath);
  return processedImagePath;
};

module.exports = new ImageProcessing();
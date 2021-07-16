require('dotenv').config();


const path = require('path');
const Neocities = require('neocities-extended');
const distPath = path.join(__dirname, '_site');
const apiKey = process.env.NEOCITIES_API_KEY;
const subdomain = process.env.NEOCITIES_SUBDOMAIN;

const doUploadWebsite = async (distPath, apiKey, subdomain) => {
  if (typeof distPath === 'undefined') throw new Error('distPath argument passed to doUploadWebsite must be a path on disk. Got undefined.');
  if (typeof apiKey === 'undefined' || typeof subdomain === 'undefined' ) throw new Error('NEOCITIES_SUBDOMAIN and NEOCITIES_API_KEY must be defined in env. At least one of them was undefined.');
  var api = new Neocities(apiKey);
  return new Promise((resolve, reject) => {
    console.log(`uploading files to ${subdomain}.neocities.org distPath:${distPath}`);
    api.push(
      distPath, // local path
      '/',      // webserver path
      [],       // excluded files
      (res) => {
        if (res.result !== 'success') reject(res);
        else (resolve(res.message));
      })
  });
}


console.log('hi');

(async () => {
  console.log(`uploading distPath:${distPath} to ${subdomain}.neocities.org`)
  try {
    await doUploadWebsite(distPath, apiKey, subdomain);
  } catch (e) {
    console.log('there was an error while attempting to upload.')
    console.error(e);
  }
})()
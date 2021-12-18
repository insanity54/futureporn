const path = require('path');
const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const decodeUriComponent = require('decode-uri-component');
const manifestPath = path.resolve(__dirname, "_site", "assets", "manifest.json");
const faviconPlugin = require("eleventy-favicon");
const manifest = JSON.parse(
  fs.readFileSync(manifestPath, { encoding: "utf8" })
);

const filterIpfsCompleted = (vods) => {
  let golo = [];
  for (const vod of vods) {
    if (vod.data.videoSrcHash !== null) golo.push(vod.data.videoSrcHash)
  }
  return golo.length;
}

const filterB2Completed = (vods) => {
  let golo = [];
  for (const vod of vods) {
    if (vod.data.videoSrc !== null) golo.push(vod.data.videoSrc)
  }
  return golo.length;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(faviconPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias("vod", "layouts/vod.njk");
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");


  eleventyConfig.addShortcode("buildIpfsUrl", function(urlFragment) {
    return `https://ipfs.io/ipfs/${urlFragment}`;
  });

  eleventyConfig.addShortcode("b2ProgressPercentage", function(vods) {
    const totalVods = vods.length;
    const completedVods = filterB2Completed(vods)
    return `${completedVods}/${totalVods} (${Math.floor(completedVods/totalVods*100)}%)`
  });

  eleventyConfig.addShortcode("ipfsProgressPercentage", function(vods) {
    const totalVods = vods.length;
    const completedVods = filterIpfsCompleted(vods)
    return `${completedVods}/${totalVods} (${Math.floor(completedVods/totalVods*100)}%)`
  });

  // Adds a universal shortcode to return the URL to a webpack asset. In Nunjack templates:
  // {% webpackAsset 'main.js' %} or {% webpackAsset 'main.css' %}
  eleventyConfig.addShortcode("webpackAsset", function(name) {
    if (!manifest[name]) {
      throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
    }
    return manifest[name];
  });

  eleventyConfig.addFilter("urlDecode", text => {
    return decodeUriComponent(text);
  });
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function(item) {
      if( "tags" in item.data ) {
        let tags = item.data.tags;

        tags = tags.filter(function(item) {
          switch(item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "vod":
            case "vods":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });




  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    dir: {
      input: "website",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };



};

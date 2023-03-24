const path = require('path');
const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { format, utcToZonedTime, } = require('date-fns-tz');
const Image = require("@11ty/eleventy-img");
const slinkity = require('slinkity')
const svelte = require('@slinkity/svelte')

const isDev = process.env.NODE_ENV === "development";


// https://stackoverflow.com/a/1527820/1004931
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const filterIpfsCompleted = (vods) => {
  let golo = [];
  for (const vod of vods) {
    if (vod.videoSrcHash !== null) golo.push(vod.videoSrcHash)
  }
  return golo.length;
}

const filterThumbnailCompleted = (vods) => 
  vods.filter((v) => v.thiccHash !== null).length;


const filterB2Completed = (vods) => {
  let golo = [];
  for (const vod of vods) {
    if (vod.videoSrc !== null) golo.push(vod.data.videoSrc)
  }
  return golo.length;
}

const filter240pTranscodeCompleted = (vods) => {
  let completed = vods.filter((v) => v.video240Hash !== null)
  return completed.length
}


async function imageShortcode(src, cls = "image", alt = '', sizes = "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px", widths = [90, 180, 360]) {

  Image.concurrency = 7
  let opts = {
    outputDir: '_site/img',
    formats: ['webp', 'jpeg'],
    dryRun: false,
    widths: widths,
    cacheOptions: { 
      concurrency: 9,
      verbose: true,
      directory: '.cache',
      duration: "*",
    }
  };

  let imageAttributes = {
    class: cls,
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    onerror: "this.style.display='none'" // avoid ugly border
  };

  let metadata


  try {
    if (process.env.FAST) {
      // Abort any slow loading downloads
      let abortController = new AbortController()
      opts.cacheOptions.fetchOptions = {
        signal: abortController.signal,
        taco: true
      }
      const timeout = setTimeout(() => {
        abortController.abort();
      }, 500);
    }
    metadata = await Image(src, opts);
  } catch (e) {
    console.warn(`catching error during image fetch ${e}`)
    metadata = await Image('./website/favicon/favicon.png', opts)
  }

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        class="${imageAttributes.class}"
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>
  `;
}


module.exports = function(eleventyConfig) {


  eleventyConfig.addPlugin(
    slinkity.plugin,
    slinkity.defineConfig({
      renderers: [svelte()]
    })
  )

  eleventyConfig.addPassthroughCopy({ "website/favicon": "/" });
  eleventyConfig.addPassthroughCopy({ "website/assets/img": "/img" });


  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setDataDeepMerge(true);

  

  eleventyConfig.addShortcode("randomIpfsPeername", function () {
    return `futureporn-peer-${getRandomInt(699,6969)}`
  })



  eleventyConfig.addShortcode("ipfsProgressComplete", function(vods) {
    return `${filterIpfsCompleted(vods)}`;
  });


  eleventyConfig.addShortcode("thumbnailProgressPercentage", function(vods) {
    const totalVods = vods.length
    const completedVods = filterThumbnailCompleted(vods)
    return `${completedVods}/${totalVods} (${Math.floor(completedVods/totalVods*100)}%)`
  })

  eleventyConfig.addShortcode("transcode240pProgressPercentage", function(vods) {
    const totalVods = vods.length
    const completedVods = filter240pTranscodeCompleted(vods)
    return `${completedVods}/${totalVods} (${Math.floor(completedVods/totalVods*100)}%)`
  })

  eleventyConfig.addShortcode("ipfsProgressTotal", function(vods) {
    return `${vods.length}`;
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

  eleventyConfig.addFilter("isArchiveComplete", function (vods) {
    const totalVodCount = vods.length
    const completedVodCount = filterIpfsCompleted(vods)
    return totalVodCount === completedVodCount
  })

  eleventyConfig.addFilter("isThumbnailsComplete", function (vods) {
    return (vods.length === filterThumbnailCompleted(vods).length)
  })

  eleventyConfig.addFilter("is240pComplete", function (vods) {
    return (vods.length === filter240pTranscodeCompleted(vods).length)
  })

  eleventyConfig.addFilter('vodUrl', (text) => {
    return `/vods/${text}/`
  })

  eleventyConfig.addFilter('stripHtml', (text) => {
    // greets ChatGPT
    return text.replace(/<[^>]+>/g, '');
  })

  eleventyConfig.addFilter('safeDate', (text) => {
    const date = utcToZonedTime(text, 'UTC');
    const formattedDate = format(date, "yyyyMMdd'T'HHmmss'Z'", { timezone: 'UTC' });
    return formattedDate;
  })

  eleventyConfig.addFilter("buildIpfsUrl", urlFragment => {
    return `https://ipfs.io/ipfs/${urlFragment}`
  });

  eleventyConfig.addFilter("stripQueryString", text => {
    return text.split(/[?#]/)[0];
  });
  eleventyConfig.addAsyncFilter("urlDecode", async (text) => {
    console.warn(`Eyy bro, something is calling urlDecode and that's not cool anymore`)
    return text
    // const duc = await import('decode-uri-component');
    // return duc.default(text);
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

  // keep text descriptions small, for design consistency
  eleventyConfig.addFilter("truncate", (text, n) => {
    if (text.length > n) return `${text.substring(0, n)}...`;
    return text
  })

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addPassthroughCopy({
      "./website/img/gen/*.avif": "/img/gen"
  });
  eleventyConfig.addPassthroughCopy({
      "./website/img/gen/*.png": "/img/gen"
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


  // // Browsersync Overrides
  // eleventyConfig.setBrowserSyncConfig({
  //   callbacks: {
  //     ready: function(err, browserSync) {
  //       const content_404 = fs.readFileSync('_site/404.html');

  //       browserSync.addMiddleware("*", (req, res) => {
  //         // Provides the 404 content without redirect.
  //         res.write(content_404);
  //         res.end();
  //       });
  //     },
  //   },
  //   ui: false,
  //   ghostMode: false
  // });


  return {
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

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

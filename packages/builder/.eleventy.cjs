const path = require('path');
const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const slinkity = require('slinkity')
const dbData = require('./website/_data/db.cjs')
const { format, utcToZonedTime, } = require('date-fns-tz');
const Image = require("@11ty/eleventy-img");


// const manifestPath = path.resolve(__dirname, "_site", "assets", "manifest.json");
// const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");



// const sharpPlugin = require('eleventy-plugin-sharp');

const isDev = process.env.NODE_ENV === "development";




async function figureHtml(src, alt) {
  let stats = await Image(src, {
    widths: [64, 128, 512],
    formats: ["avif", "png"],
    urlPath: "/img/gen/",
    outputDir: "./website/img/gen/",
    cacheOptions: {
      duration: '*'
    }
  });
  return Image.generateHTML(stats, {
    class: 'image',
    alt: alt,
    sizes: ["(max-width: 768px)", "(max-width: 769px)", "(max-width: 1024px)"],
    decoding: "async",
    loading: "lazy",
  });
}


// const Image = require("@11ty/eleventy-img");
// Image.concurrency = 1;

// const manifest = JSON.parse(
//   fs.readFileSync(manifestPath, { encoding: "utf8" })
// );

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

const filterB2Completed = (vods) => {
  let golo = [];
  for (const vod of vods) {
    if (vod.data.videoSrc !== null) golo.push(vod.data.videoSrc)
  }
  return golo.length;
}

// async function imageShortcode(src, cls = "image", alt = '', sizes = "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px", widths = [90, 180, 360]) {
//   let options = {
//     outputDir: './_site/img',
//     widths: widths,
//     formats: ['jpeg', 'avif'],
//     concurrency: 1,
//     cacheOptions: { 
//       directory: '.cache',
//       duration: "*"
//     }
//   };
//   // let isCid = /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/.test(src)
//   // let url = isCid ? buildIpfsUrl(src) : src
//   let imageAttributes = {
//     class: cls,
//     alt,
//     sizes,
//     loading: "lazy",
//     decoding: "async",
//     onerror: "this.style.display='none'" // avoid ugly border
//   };
//   try {
//     console.log(`  [*] Downloading ${src}`)
//     let metadata = await Image(src, options);
//     return Image.generateHTML(metadata, imageAttributes)
//   } catch (e) {
//     console.error('We got an Image fetch error. Defaulting to Melface')
//     console.error(e);
//     let metadata = await Image('./website/favicon/favicon.png', options);
//     return Image.generateHTML(metadata, imageAttributes)
//   }
// }


// function imageShortcode(
//   src, 
//   cls = "image", 
//   alt = "", 
//   sizes = "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px", 
//   widths = [90, 180, 360]
// ) {
//   console.log(`  [*] getting ${src}`)
//   let img = sharpPlugin.getUrl(src)
//   return `
//     <picture>
//       <source 
//         type="image/avif" 
//         srcset="/img/vlhQdaV-L1-64.avif 64w" 
//         sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
//       >
//       <img 
//         class="image" 
//         alt="" 
//         loading="lazy" 
//         decoding="async" 
//         onerror="this.style.display='none'" 
//         src="/img/vlhQdaV-L1-64.jpeg" 
//         width="64" 
//         height="65"
//       >
//     </picture>`
// }


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

  // eleventyConfig.addCollection('vods', function (collection) {
  //   // get unsorted items
  //   return collection
  //     .getFilteredByTag("vod")
  //     .sort((a, b) => {
  //       console.log(`>>>subtracting ${a.date} minus ${b.date}`)
  //       return a.date - b.date
  //     })
  // })

  eleventyConfig.addPassthroughCopy({ "website/favicon": "/" });
  eleventyConfig.addPassthroughCopy({ "website/assets/img": "/img" });
  // eleventyConfig.addPassthroughCopy({
  //     "website/assts/img/gen/*.avif": "/img/gen"
  // });
  // eleventyConfig.addPassthroughCopy({
  //     "website/assts/img/gen/*.png": "/img/gen"
  // });

  // eleventyConfig.addPlugin(imageDownloader);
  // eleventyConfig.addPlugin(sharpPlugin({
  //   urlPath: '/img',
  //   outputDir: '_site/img'
  // }));
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.setDataDeepMerge(true);

  // eleventyConfig.addLayoutAlias("vod", "_includes/layouts/vod.njk");
  // eleventyConfig.addLayoutAlias("base", "_includes/layouts/base.njk");


  

  eleventyConfig.addShortcode("randomIpfsPeername", function () {
    return `futureporn-peer-${getRandomInt(699,6969)}`
  })

  eleventyConfig.addShortcode("ipfsProgressComplete", function(vods) {
    return `${filterIpfsCompleted(vods)}`;
  });

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

  // // Adds a universal shortcode to return the URL to a webpack asset. In Nunjack templates:
  // // {% webpackAsset 'main.js' %} or {% webpackAsset 'main.css' %}
  // eleventyConfig.addShortcode("webpackAsset", function(name) {
  //   if (!manifest[name]) {
  //     throw new Error(`The asset ${name} does not exist in ${manifestPath}`);
  //   }
  //   return manifest[name];
  // });

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

  // eleventyConfig.addNunjucksAsyncShortcode("getFigureHtml", figureHtml);
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

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // eleventyConfig.addPlugin(EleventyVitePlugin);
  eleventyConfig.addPlugin(
    slinkity.plugin, 
    slinkity.defineConfig({
      // renderers: [vue()], // too many errors! Maybe revisit when slinkity is more mature
    })
  )


  return {
    templateFormats: [
      "md",
      "njk",
      "html"
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

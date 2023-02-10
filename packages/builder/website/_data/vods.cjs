// const EleventyFetch = require("@11ty/eleventy-fetch");

// module.exports = async function() {
//   // https://developer.github.com/v3/repos/#get
//   let json = await EleventyFetch("https://api.github.com/repos/11ty/eleventy", {
//     duration: "1d", // 1 day
//     type: "json" // also supports "text" or "buffer"
//   });

//   return {
//     stargazers: json.stargazers_count
//   };
// };
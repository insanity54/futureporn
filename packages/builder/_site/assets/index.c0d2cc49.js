import "./modulepreload-polyfill.c7c6310f.js";
import { l as load, _ as __vitePreload, p as propsById } from "./_slinkity_props_inputPath_.__website_vod-pages.e9a3a912.js";
import "./base.80db5fc5.js";
/* empty css                 */const props$1 = {};
for (let propId of ["5TDnvU", "3V1jsZ", "JStc_M", "x1v7bk", "oCd3_2"]) {
  const { name, value } = propsById[propId];
  props$1[name] = value;
}
const target$1 = document.querySelector('slinkity-root[data-id="tSuOEz"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./VideoPlayer.70a4aee3.js"), true ? ["assets/VideoPlayer.70a4aee3.js","assets/_slinkity_props_inputPath_.__website_vod-pages.e9a3a912.js","assets/_slinkity_props_inputPath_.7b587928.css","assets/store.78950e7d.js","assets/common.5d0d2fe0.js"] : void 0),
    __vitePreload(() => import("./client.3459407c.js"), true ? [] : void 0)
  ]);
  renderer({
    Component,
    target: target$1,
    props: props$1,
    slots: { "default": "" },
    isClientOnly: false
  });
});
const props = {};
for (let propId of ["eZ8-a2", "eCuuum"]) {
  const { name, value } = propsById[propId];
  props[name] = value;
}
const target = document.querySelector('slinkity-root[data-id="8qdLpO"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./GatewaySelector.e0ec0ddf.js"), true ? ["assets/GatewaySelector.e0ec0ddf.js","assets/store.78950e7d.js"] : void 0),
    __vitePreload(() => import("./client.3459407c.js"), true ? [] : void 0)
  ]);
  renderer({
    Component,
    target,
    props,
    slots: { "default": "" },
    isClientOnly: false
  });
});

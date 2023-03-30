import "./modulepreload-polyfill.c7c6310f.js";
import { l as load, _ as __vitePreload, p as propsById } from "./_slinkity_props_inputPath_.__website_vod-pages.6630a7a5.js";
import "./base.80db5fc5.js";
/* empty css                 */const props$1 = {};
for (let propId of ["Q6foCV", "vrTvuN", "GbkiZy", "EM-_qi", "CaALkW"]) {
  const { name, value } = propsById[propId];
  props$1[name] = value;
}
const target$1 = document.querySelector('slinkity-root[data-id="mmyXGJ"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./VideoPlayer.9387d323.js"), true ? ["assets/VideoPlayer.9387d323.js","assets/_slinkity_props_inputPath_.__website_vod-pages.6630a7a5.js","assets/_slinkity_props_inputPath_.7b587928.css","assets/store.78950e7d.js","assets/common.5d0d2fe0.js"] : void 0),
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
for (let propId of ["lSbncv", "QXitrh"]) {
  const { name, value } = propsById[propId];
  props[name] = value;
}
const target = document.querySelector('slinkity-root[data-id="ngEsRS"]');
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

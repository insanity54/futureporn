import "./modulepreload-polyfill.c7c6310f.js";
import { l as load, _ as __vitePreload, p as propsById } from "./_slinkity_props_inputPath_.__website_vod-pages.e9a3a912.js";
import "./base.80db5fc5.js";
/* empty css                 */const props$2 = {};
for (let propId of ["hqNV9H", "xF2kD4", "hBg75B", "Vtb2uC", "X8LnC_"]) {
  const { name, value } = propsById[propId];
  props$2[name] = value;
}
const target$2 = document.querySelector('slinkity-root[data-id="VCkBLJ"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./VideoPlayer.70a4aee3.js"), true ? ["assets/VideoPlayer.70a4aee3.js","assets/_slinkity_props_inputPath_.__website_vod-pages.e9a3a912.js","assets/_slinkity_props_inputPath_.7b587928.css","assets/store.78950e7d.js","assets/common.5d0d2fe0.js"] : void 0),
    __vitePreload(() => import("./client.3459407c.js"), true ? [] : void 0)
  ]);
  renderer({
    Component,
    target: target$2,
    props: props$2,
    slots: { "default": "" },
    isClientOnly: false
  });
});
const props$1 = {};
for (let propId of ["kAOf5M", "-JRsyp"]) {
  const { name, value } = propsById[propId];
  props$1[name] = value;
}
const target$1 = document.querySelector('slinkity-root[data-id="NHAGeM"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./GatewaySelector.e0ec0ddf.js"), true ? ["assets/GatewaySelector.e0ec0ddf.js","assets/store.78950e7d.js"] : void 0),
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
for (let propId of ["KiNIlJ"]) {
  const { name, value } = propsById[propId];
  props[name] = value;
}
const target = document.querySelector('slinkity-root[data-id="S_qrhf"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./IpfsLink.b7207e56.js"), true ? ["assets/IpfsLink.b7207e56.js","assets/store.78950e7d.js","assets/common.5d0d2fe0.js"] : void 0),
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

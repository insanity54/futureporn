import "./modulepreload-polyfill.c7c6310f.js";
import { l as load, _ as __vitePreload, p as propsById } from "./_slinkity_props_inputPath_.%2Fwebsite%2Fvod-pages.9b3d8a24.js";
import "./base.8c82c83a.js";
/* empty css                 */const props$2 = {};
for (let propId of ["24yJcD", "CkzTQU", "XLOIbl", "A0o4Xy", "DxD8pX"]) {
  const { name, value } = propsById[propId];
  props$2[name] = value;
}
const target$2 = document.querySelector('slinkity-root[data-id="VDGuQG"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./VideoPlayer.5ba3062f.js"), true ? ["assets/VideoPlayer.5ba3062f.js","assets/store.6e58cc19.js","assets/_slinkity_props_inputPath_.%2Fwebsite%2Fvod-pages.9b3d8a24.js","assets/_slinkity_props_inputPath_.fe49c119.css","assets/common.11e61d89.js","assets/VideoPlayer.5b64050c.css"] : void 0),
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
for (let propId of ["JvEJ6B"]) {
  const { name, value } = propsById[propId];
  props$1[name] = value;
}
const target$1 = document.querySelector('slinkity-root[data-id="W53_Qn"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./GatewaySelector.150c03dc.js"), true ? ["assets/GatewaySelector.150c03dc.js","assets/store.6e58cc19.js"] : void 0),
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
for (let propId of ["0F4NXY"]) {
  const { name, value } = propsById[propId];
  props[name] = value;
}
const target = document.querySelector('slinkity-root[data-id="tIzDNH"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./IpfsLink.2361bfd2.js"), true ? ["assets/IpfsLink.2361bfd2.js","assets/store.6e58cc19.js","assets/common.11e61d89.js"] : void 0),
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

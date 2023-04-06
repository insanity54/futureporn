import "./base.746db6a9.js";
import { l as load, _ as __vitePreload, p as propsById } from "./_slinkity_props_inputPath_.__website_vod-pages.6d72b607.js";
const props$2 = {};
for (let propId of ["UhQFJO", "qJagN9", "ZG44NV", "aKAfPw", "C8JHS1"]) {
  const { name, value } = propsById[propId];
  props$2[name] = value;
}
const target$2 = document.querySelector('slinkity-root[data-id="dEcwb7"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./VideoPlayer.c867166c.js"), true ? ["assets/VideoPlayer.c867166c.js","assets/_slinkity_props_inputPath_.__website_vod-pages.6d72b607.js","assets/_slinkity_props_inputPath_.082db77e.css","assets/store.78950e7d.js","assets/common.5d0d2fe0.js"] : void 0),
    __vitePreload(() => import("./client.5b156202.js"), true ? [] : void 0)
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
for (let propId of ["xKPd1P", "3p0bz-"]) {
  const { name, value } = propsById[propId];
  props$1[name] = value;
}
const target$1 = document.querySelector('slinkity-root[data-id="2t0kaK"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./GatewaySelector.e0ec0ddf.js"), true ? ["assets/GatewaySelector.e0ec0ddf.js","assets/store.78950e7d.js"] : void 0),
    __vitePreload(() => import("./client.5b156202.js"), true ? [] : void 0)
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
for (let propId of ["0LfUZW"]) {
  const { name, value } = propsById[propId];
  props[name] = value;
}
const target = document.querySelector('slinkity-root[data-id="BvVkUK"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./IpfsLink.b7207e56.js"), true ? ["assets/IpfsLink.b7207e56.js","assets/store.78950e7d.js","assets/common.5d0d2fe0.js"] : void 0),
    __vitePreload(() => import("./client.5b156202.js"), true ? [] : void 0)
  ]);
  renderer({
    Component,
    target,
    props,
    slots: { "default": "" },
    isClientOnly: false
  });
});

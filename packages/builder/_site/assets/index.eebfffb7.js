import "./all.2afbd082.js";
import { l as load, _ as __vitePreload, p as propsById } from "./player.b4c351b1.js";
const props$2 = {};
const target$2 = document.querySelector('slinkity-root[data-id="S_Tv84"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./IpfsGatewaySwitcher.40d314e6.js"), true ? ["assets/IpfsGatewaySwitcher.40d314e6.js","assets/store.e8033af7.js"] : void 0),
    __vitePreload(() => import("./client.8793d47a.js"), true ? [] : void 0)
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
for (let propId of ["PPSq1b"]) {
  const { name, value } = propsById[propId];
  props$1[name] = value;
}
const target$1 = document.querySelector('slinkity-root[data-id="YDE3l4"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./IpfsLink.16f2711e.js"), true ? ["assets/IpfsLink.16f2711e.js","assets/store.e8033af7.js"] : void 0),
    __vitePreload(() => import("./client.8793d47a.js"), true ? [] : void 0)
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
for (let propId of ["q_OJTz"]) {
  const { name, value } = propsById[propId];
  props[name] = value;
}
const target = document.querySelector('slinkity-root[data-id="bQuZix"]');
Promise.race([
  load()
]).then(async function() {
  const [{ default: Component }, { default: renderer }] = await Promise.all([
    __vitePreload(() => import("./IpfsLink.16f2711e.js"), true ? ["assets/IpfsLink.16f2711e.js","assets/store.e8033af7.js"] : void 0),
    __vitePreload(() => import("./client.8793d47a.js"), true ? [] : void 0)
  ]);
  renderer({
    Component,
    target,
    props,
    slots: { "default": "" },
    isClientOnly: false
  });
});

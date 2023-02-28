import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, t as text, c as claim_element, a as children, b as claim_text, d as detach, f as attr, g as insert_hydration, h as append_hydration, l as listen, n as noop, j as gatewayStore } from "./store.e8033af7.js";
function create_fragment(ctx) {
  let button;
  let t;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      t = text("Switch IPFS Gateway");
      this.h();
    },
    l(nodes) {
      button = claim_element(nodes, "BUTTON", { class: true });
      var button_nodes = children(button);
      t = claim_text(button_nodes, "Switch IPFS Gateway");
      button_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button, "class", "button is-small");
    },
    m(target, anchor) {
      insert_hydration(target, button, anchor);
      append_hydration(button, t);
      if (!mounted) {
        dispose = listen(button, "click", ctx[0]);
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function instance($$self) {
  let gateways = ["ipfs.io", "gateway.pinata.cloud", "via0.com", "hardbin.com"];
  let gatewayIndex = 0;
  function switchGateway() {
    gatewayIndex = (gatewayIndex + 1) % gateways.length;
    gatewayStore.set(gateways[gatewayIndex]);
  }
  return [switchGateway];
}
class IpfsGatewaySwitcher extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  IpfsGatewaySwitcher as default
};

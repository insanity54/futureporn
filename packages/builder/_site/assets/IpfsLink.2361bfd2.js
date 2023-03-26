import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, L as text, a as claim_element, b as children, M as claim_text, d as detach, C as attr, f as insert_hydration, F as append_hydration, N as set_data, D as noop, P as derived, r as component_subscribe, v as defaultGateway } from "./store.6e58cc19.js";
import { b as buildIpfsUrl } from "./common.11e61d89.js";
function create_fragment(ctx) {
  let a;
  let t;
  return {
    c() {
      a = element("a");
      t = text(ctx[0]);
      this.h();
    },
    l(nodes) {
      a = claim_element(nodes, "A", { href: true });
      var a_nodes = children(a);
      t = claim_text(a_nodes, ctx[0]);
      a_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a, "href", ctx[0]);
    },
    m(target, anchor) {
      insert_hydration(target, a, anchor);
      append_hydration(a, t);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t, ctx2[0]);
      if (dirty & 1) {
        attr(a, "href", ctx2[0]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(a);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $ipfsUrl;
  let { cid = "" } = $$props;
  let ipfsUrl = derived(defaultGateway, ($defaultGateway) => {
    try {
      return buildIpfsUrl($defaultGateway.pattern, cid);
    } catch (error) {
      console.error(error);
      return "";
    }
  });
  component_subscribe($$self, ipfsUrl, (value) => $$invalidate(0, $ipfsUrl = value));
  $$self.$$set = ($$props2) => {
    if ("cid" in $$props2)
      $$invalidate(2, cid = $$props2.cid);
  };
  return [$ipfsUrl, ipfsUrl, cid];
}
class IpfsLink extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { cid: 2 });
  }
}
export {
  IpfsLink as default
};

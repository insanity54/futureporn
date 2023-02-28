import { S as SvelteComponent, i as init, s as safe_not_equal, k as assign, e as element, t as text, c as claim_element, a as children, b as claim_text, d as detach, m as set_attributes, g as insert_hydration, h as append_hydration, o as set_data, p as get_spread_update, n as noop, q as compute_rest_props, r as component_subscribe, j as gatewayStore, u as onMount, v as onDestroy, w as exclude_internal_props } from "./store.e8033af7.js";
function create_fragment(ctx) {
  let p;
  let a;
  let t;
  let a_levels = [{ href: ctx[0] }, ctx[1]];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      p = element("p");
      a = element("a");
      t = text(ctx[0]);
      this.h();
    },
    l(nodes) {
      p = claim_element(nodes, "P", {});
      var p_nodes = children(p);
      a = claim_element(p_nodes, "A", { href: true });
      var a_nodes = children(a);
      t = claim_text(a_nodes, ctx[0]);
      a_nodes.forEach(detach);
      p_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_attributes(a, a_data);
    },
    m(target, anchor) {
      insert_hydration(target, p, anchor);
      append_hydration(p, a);
      append_hydration(a, t);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t, ctx2[0]);
      set_attributes(a, a_data = get_spread_update(a_levels, [
        dirty & 1 && { href: ctx2[0] },
        dirty & 2 && ctx2[1]
      ]));
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  const omit_props_names = ["cid"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let $gatewayStore;
  component_subscribe($$self, gatewayStore, ($$value) => $$invalidate(3, $gatewayStore = $$value));
  let { cid } = $$props;
  let href = "";
  const unsubscribe = gatewayStore.subscribe((gateway) => {
    $$invalidate(0, href = `https://${gateway}/ipfs/${cid}`);
  });
  onMount(() => {
    $$invalidate(0, href = `https://${$gatewayStore}/ipfs/${cid}`);
  });
  onDestroy(() => {
    unsubscribe();
  });
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("cid" in $$new_props)
      $$invalidate(2, cid = $$new_props.cid);
  };
  return [href, $$restProps, cid];
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

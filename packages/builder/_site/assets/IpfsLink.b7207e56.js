import { S as SvelteComponent, i as init, s as safe_not_equal, c as create_slot, e as element, D as text, f as claim_element, g as children, E as claim_text, h as detach, k as attr, l as insert_hydration, m as append_hydration, F as set_data, u as update_slot_base, n as get_all_dirty_from_scope, o as get_slot_changes, t as transition_in, p as transition_out, H as derived, q as component_subscribe, v as defaultGateway } from "./store.78950e7d.js";
import { b as buildIpfsUrl } from "./common.5d0d2fe0.js";
function create_fragment(ctx) {
  let a;
  let t;
  let current;
  const default_slot_template = ctx[4].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  return {
    c() {
      a = element("a");
      t = text(ctx[0]);
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      a = claim_element(nodes, "A", { href: true });
      var a_nodes = children(a);
      t = claim_text(a_nodes, ctx[0]);
      a_nodes.forEach(detach);
      if (default_slot)
        default_slot.l(nodes);
      this.h();
    },
    h() {
      attr(a, "href", ctx[0]);
    },
    m(target, anchor) {
      insert_hydration(target, a, anchor);
      append_hydration(a, t);
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & 1)
        set_data(t, ctx2[0]);
      if (!current || dirty & 1) {
        attr(a, "href", ctx2[0]);
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[3],
            !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $ipfsUrl;
  let { $$slots: slots = {}, $$scope } = $$props;
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
    if ("$$scope" in $$props2)
      $$invalidate(3, $$scope = $$props2.$$scope);
  };
  return [$ipfsUrl, ipfsUrl, cid, $$scope, slots];
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

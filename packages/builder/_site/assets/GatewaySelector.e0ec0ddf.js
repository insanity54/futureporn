import { S as SvelteComponent, i as init, s as safe_not_equal, c as create_slot, e as element, b as empty, f as claim_element, g as children, h as detach, k as attr, y as add_render_callback, l as insert_hydration, m as append_hydration, z as select_option, A as listen, u as update_slot_base, n as get_all_dirty_from_scope, o as get_slot_changes, t as transition_in, p as transition_out, B as destroy_each, C as run_all, q as component_subscribe, D as text, E as claim_text, F as set_data, v as defaultGateway, G as select_value } from "./store.78950e7d.js";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[8] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let option;
  let t_value = ctx[8].hostname + "";
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option = claim_element(nodes, "OPTION", {});
      var option_nodes = children(option);
      t = claim_text(option_nodes, t_value);
      option_nodes.forEach(detach);
      this.h();
    },
    h() {
      option.__value = option_value_value = ctx[8].hostname;
      option.value = option.__value;
    },
    m(target, anchor) {
      insert_hydration(target, option, anchor);
      append_hydration(option, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = ctx2[8].hostname + ""))
        set_data(t, t_value);
      if (dirty & 1 && option_value_value !== (option_value_value = ctx2[8].hostname)) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_fragment(ctx) {
  let div;
  let select;
  let each_1_anchor;
  let current;
  let mounted;
  let dispose;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[4], null);
  return {
    c() {
      div = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      div = claim_element(nodes, "DIV", { class: true });
      var div_nodes = children(div);
      select = claim_element(div_nodes, "SELECT", { class: true });
      var select_nodes = children(select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(select_nodes);
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.l(select_nodes);
      select_nodes.forEach(detach);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(select, "class", "gateway-selector");
      if (ctx[1].hostname === void 0)
        add_render_callback(() => ctx[6].call(select));
      attr(div, "class", "select is-primary");
    },
    m(target, anchor) {
      insert_hydration(target, div, anchor);
      append_hydration(div, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      append_hydration(select, each_1_anchor);
      if (default_slot) {
        default_slot.m(select, null);
      }
      select_option(select, ctx[1].hostname, true);
      current = true;
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[2]),
          listen(select, "change", ctx[6])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[4],
            !current ? get_all_dirty_from_scope(ctx2[4]) : get_slot_changes(default_slot_template, ctx2[4], dirty, null),
            null
          );
        }
      }
      if (dirty & 3) {
        select_option(select, ctx2[1].hostname);
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
        detach(div);
      destroy_each(each_blocks, detaching);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $defaultGateway;
  component_subscribe($$self, defaultGateway, ($$value) => $$invalidate(1, $defaultGateway = $$value));
  let { $$slots: slots = {}, $$scope } = $$props;
  let { freeGateways = [] } = $$props;
  let { premiumGateways = [] } = $$props;
  let allGateways = freeGateways.concat(premiumGateways);
  function setGateway(evt) {
    const hostname = evt.target.value;
    const gateway = allGateways.find((gw) => gw.hostname == hostname);
    defaultGateway.set(gateway);
  }
  function select_change_handler() {
    $defaultGateway.hostname = select_value(this);
    defaultGateway.set($defaultGateway);
    $$invalidate(0, freeGateways);
  }
  $$self.$$set = ($$props2) => {
    if ("freeGateways" in $$props2)
      $$invalidate(0, freeGateways = $$props2.freeGateways);
    if ("premiumGateways" in $$props2)
      $$invalidate(3, premiumGateways = $$props2.premiumGateways);
    if ("$$scope" in $$props2)
      $$invalidate(4, $$scope = $$props2.$$scope);
  };
  return [
    freeGateways,
    $defaultGateway,
    setGateway,
    premiumGateways,
    $$scope,
    slots,
    select_change_handler
  ];
}
class GatewaySelector extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { freeGateways: 0, premiumGateways: 3 });
  }
}
export {
  GatewaySelector as default
};

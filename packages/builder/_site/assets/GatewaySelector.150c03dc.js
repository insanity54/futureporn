import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, a as claim_element, b as children, d as detach, C as attr, G as add_render_callback, f as insert_hydration, F as append_hydration, H as select_option, I as listen, D as noop, J as destroy_each, K as run_all, r as component_subscribe, L as text, M as claim_text, N as set_data, v as defaultGateway, O as select_value } from "./store.6e58cc19.js";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[4] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let option;
  let t_value = ctx[4].hostname + "";
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
      option.__value = option_value_value = ctx[4].hostname;
      option.value = option.__value;
    },
    m(target, anchor) {
      insert_hydration(target, option, anchor);
      append_hydration(option, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = ctx2[4].hostname + ""))
        set_data(t, t_value);
      if (dirty & 1 && option_value_value !== (option_value_value = ctx2[4].hostname)) {
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
  let mounted;
  let dispose;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
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
      select_nodes.forEach(detach);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(select, "class", "gateway-selector");
      if (ctx[1].hostname === void 0)
        add_render_callback(() => ctx[3].call(select));
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
      select_option(select, ctx[1].hostname, true);
      if (!mounted) {
        dispose = [
          listen(select, "change", ctx[2]),
          listen(select, "change", ctx[3])
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
            each_blocks[i].m(select, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & 3) {
        select_option(select, ctx2[1].hostname);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $defaultGateway;
  component_subscribe($$self, defaultGateway, ($$value) => $$invalidate(1, $defaultGateway = $$value));
  let { gateways = [] } = $$props;
  function setGateway(evt) {
    const hostname = evt.target.value;
    const gateway = gateways.find((gw) => gw.hostname == hostname);
    defaultGateway.set(gateway);
  }
  function select_change_handler() {
    $defaultGateway.hostname = select_value(this);
    defaultGateway.set($defaultGateway);
    $$invalidate(0, gateways);
  }
  $$self.$$set = ($$props2) => {
    if ("gateways" in $$props2)
      $$invalidate(0, gateways = $$props2.gateways);
  };
  return [gateways, $defaultGateway, setGateway, select_change_handler];
}
class GatewaySelector extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { gateways: 0 });
  }
}
export {
  GatewaySelector as default
};

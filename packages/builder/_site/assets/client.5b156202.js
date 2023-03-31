function client({ Component, target, props, slots, isClientOnly }) {
  new Component({
    target,
    props: {
      ...props,
      $$slots: Object.fromEntries(
        Object.entries(slots).map(([key, value]) => [key, createSlotDefinition(value)])
      ),
      $$scope: { ctx: [] }
    },
    hydrate: !isClientOnly
  });
}
function createSlotDefinition(children) {
  return [
    () => ({
      m(target) {
        target.insertAdjacentHTML("beforeend", children);
      },
      c: noop,
      l: noop,
      d: noop
    }),
    noop,
    noop
  ];
}
const noop = () => {
};
export {
  client as default
};

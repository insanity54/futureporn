<script>

  import { gatewayStore } from '/@includes/js/store.js';

  // @todo make the gw list come from _data/
  let gateways = [
    'ipfs.io',
    'gateway.pinata.cloud',
    'via0.com',
    'hardbin.com'
  ];
  let gatewayIndex = 0;

  function switchGateway() {
    gatewayIndex = (gatewayIndex + 1) % gateways.length;
    gatewayStore.set(gateways[gatewayIndex]);
  }
</script>

<button class="button is-small" on:click={switchGateway}>
  Switch IPFS Gateway
</button>

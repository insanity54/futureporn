

<script>
  import { defaultGateway } from "/@includes/js/store.js"


  export let freeGateways = []
  export let premiumGateways = []
  let allGateways = freeGateways.concat(premiumGateways)


  function setGateway (evt) {
    const hostname = evt.target.value
    const gateway = allGateways.find((gw) => gw.hostname == hostname)
    defaultGateway.set(gateway)

  }

</script>



<div class="select is-primary">
  <select 
    class="gateway-selector"
    on:change={setGateway}
    bind:value={$defaultGateway.hostname}
  >

  {#each freeGateways as gw}
    <option>{ gw.hostname }</option>
  {/each}
  <slot></slot>

  </select>
</div>


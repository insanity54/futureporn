

<script>
  export let gateways = []
  import { defaultGateway } from "/@includes/js/store.js"


  function setGateway (evt) {
    const hostname = evt.target.value
    const gateway = gateways.find((gw) => gw.hostname == hostname)
    defaultGateway.set(gateway)
  }

</script>



<div class="select is-primary">
  <select 
    class="gateway-selector"
    on:change={setGateway}
  >
  {#each gateways as gw}
    <option>{ gw.hostname }</option>
  {/each}
  </select>
</div>


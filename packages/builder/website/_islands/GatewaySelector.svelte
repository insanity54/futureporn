

<script>
  export let gateways = []
  import { defaultGateway } from "/@includes/js/store.js"
</script>


<div class="select is-primary">
  <select 
    class="gateway-selector"
    
  >
  {#each gateways as gw}
    <option>{ gw.hostname }{#if gw.note} ({ gw.note }){/if}</option>
  {/each}
  </select>
</div>


<script>
  import { gatewayStore } from '/@includes/js/store.js';
  import { onMount, onDestroy } from 'svelte';

  export let cid;
  let href = '';

  const unsubscribe = gatewayStore.subscribe(gateway => {
    href = `https://${gateway}/ipfs/${cid}`;
  });

  onMount(() => {
    href = `https://${$gatewayStore}/ipfs/${cid}`;
  });

  onDestroy(() => {
    unsubscribe();
  });


</script>

<p><a {href}{...$$restProps}>{href}</a></p>
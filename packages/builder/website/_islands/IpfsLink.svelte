<script>
  import { defaultGateway } from "/@includes/js/store.js"
  import { derived } from 'svelte/store'
  import { buildIpfsUrl } from "/@includes/js/common.js"

  export let cid = '';

  let ipfsUrl = derived(defaultGateway, $defaultGateway => {
    try {
      return buildIpfsUrl($defaultGateway.pattern, cid);
    } catch (error) {
      console.error(error);
      return '';
    }
  });
</script>

<a href="{$ipfsUrl}">{$ipfsUrl}</a>

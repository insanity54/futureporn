<script>
  import { defaultGateway } from "/@includes/js/store.js"
  import { derived } from 'svelte/store'
  import { buildIpfsUrl } from "/@includes/js/common.js"

  export let videoSrcHash = ''

  let ipfsUrl = derived(defaultGateway, $defaultGateway => buildIpfsUrl($defaultGateway.pattern, videoSrcHash))

</script>


<h1>Test.svelte</h1>
<p>ipfsUrl:{$ipfsUrl}</p>
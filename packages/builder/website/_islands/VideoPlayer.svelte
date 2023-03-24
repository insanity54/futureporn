
<script>
  import { Plyr } from "svelte-plyr";

  export const videoSrcHash = '';
  export const video720Hash = '';
  export const video360Hash = '';
  export const video240Hash = '';
  export const thiccHash = '';


  function logEvent(event) {
    console.log(event)
  }

  function buildIpfsUrl (cid) {
    return `https://ipfs.io/ipfs/${cid}`
  }

  let player
  let eventsToEmit = ['timeupdate']

</script>


<Plyr 
  autoplay=false
  muted=true
  on:timeupdate={logEvent}
  eventsToEmit={eventsToEmit}
  bind:player={player}
>


  {#if !!videoSrcHash}
  <source 
    src="{buildIpfsUrl(videoSrcHash)}" 
    size="1080" 
    type="video/mp4"
  >
  {/if}

  {#if !!video720Hash}
  <source 
    src="{buildIpfsUrl(video720Hash)}" 
    size="720" 
    type="video/mp4"
  >
  {/if}

  {#if !!video360Hash}
  <source 
    src="{buildIpfsUrl(video360Hash)}" 
    size="360" 
    type="video/mp4"
  >
  {/if}

  {#if !!video240Hash}
  <source 
    src="{buildIpfsUrl(video240Hash)}" 
    size="240" 
    type="video/mp4"
  >
  {/if}


</Plyr>


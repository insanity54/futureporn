  
<script>
  import { Plyr } from "svelte-plyr"
  import { defaultGateway } from "/@includes/js/store.js"
  import { onMount, onDestroy } from 'svelte'
  import { derived } from 'svelte/store'
  import { buildIpfsUrl } from "/@includes/js/common.js"

  // custom controls ->> https://github.com/sampotts/plyr/blob/master/CONTROLS.md#limitations

  function logEvent(event) {
    console.log(event)
  }


  export let videoSrcHash = '';
  export let video720Hash = '';
  export let video360Hash = '';
  export let video240Hash = '';
  export let thiccHash = '';

  let player
  let eventsToEmit = ['timeupdate']


  $: videoSrcUrl = buildIpfsUrl($defaultGateway.pattern, videoSrcHash);
  $: video720Url = buildIpfsUrl($defaultGateway.pattern, video720Hash);
  $: video360Url = buildIpfsUrl($defaultGateway.pattern, video360Hash);
  $: video240Url = buildIpfsUrl($defaultGateway.pattern, video240Hash);
  $: thiccUrl = buildIpfsUrl($defaultGateway.pattern, thiccHash);


  // update the video player sources when the gateway is changed
  const unsub = defaultGateway.subscribe((gw) => {
    console.log(`change detected!`)
    console.log(gw)

    if (typeof player !== 'undefined' && typeof player.source !== 'undefined') {

      let sources = []

      if (videoSrcUrl) sources.push({
        src: buildIpfsUrl($defaultGateway.pattern, videoSrcHash),
        type: 'video/mp4',
        size: 1080
      });

      if (video720Url) sources.push({
        src: buildIpfsUrl($defaultGateway.pattern, video720Hash),
        type: 'video/mp4',
        size: 720
      });

      if (video360Url) sources.push({
        src: buildIpfsUrl($defaultGateway.pattern, video360Hash),
        type: 'video/mp4',
        size: 360
      });

      if (video240Url) sources.push({
        src: buildIpfsUrl($defaultGateway.pattern, video240Hash),
        type: 'video/mp4',
        size: 240
      });

      console.log('setting player sources to the following')
      console.log(sources)

      player.source = {
        type: 'video',
        title: 'videoTitle',
        sources
      };
    }
  })


  onDestroy(unsub)

</script>

<style scoped>
  .video-placeholder {
    background-color: purple;
    height: 50px;
    width: 50px;
  }
</style>

<slot></slot>


{#if typeof window === "undefined"}
  <div class="video-placeholder"></div>
{:else}
  <Plyr 
    on:timeupdate={logEvent}
    eventsToEmit={eventsToEmit}
    bind:player={player}
  >

    <video
      poster="{buildIpfsUrl($defaultGateway.pattern, thiccHash)}"
      src="{buildIpfsUrl($defaultGateway.pattern, videoSrcHash)}"
    >
      {#if videoSrcHash}
      <source 
        src="{buildIpfsUrl($defaultGateway.pattern, videoSrcHash)}" 
        type="video/mp4"
        size="1080"
      >
      {/if}

      {#if video720Hash}
      <source 
        src="{buildIpfsUrl($defaultGateway.pattern, videoSrcHash)}" 
        type="video/mp4"
        size="720"
      >
      {/if}

      {#if video360Hash}
      <source 
        src="{buildIpfsUrl($defaultGateway.pattern, video360Hash)}" 
        type="video/mp4"
        size="360"
      >
      {/if}


      {#if video240Hash}
      <source 
        src="{buildIpfsUrl($defaultGateway.pattern, video240Hash)}" 
        type="video/mp4"
        size="240"
      >
      {/if}
    </video>

  </Plyr>

{/if}

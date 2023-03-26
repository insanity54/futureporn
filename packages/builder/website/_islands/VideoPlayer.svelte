  
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
  let videoSrcUrl = derived(defaultGateway, ($defaultGateway) => buildIpfsUrl($defaultGateway.pattern, videoSrcHash))
  let video720Url = derived(defaultGateway, ($defaultGateway) => buildIpfsUrl($defaultGateway.pattern, video720Hash))
  let video360Url = derived(defaultGateway, ($defaultGateway) => buildIpfsUrl($defaultGateway.pattern, video360Hash))
  let video240Url = derived(defaultGateway, ($defaultGateway) => buildIpfsUrl($defaultGateway.pattern, video240Hash))
  let thiccUrl = derived(defaultGateway, ($defaultGateway) => buildIpfsUrl($defaultGateway.pattern, thiccHash))


  const unsub = videoSrcUrl.subscribe((url) => {
    console.log(`change detected! ${url}`)

    if (typeof player !== 'undefined' && typeof player.source !== 'undefined') {

      let sources = []

      if ($videoSrcUrl) sources.push({
        src: $videoSrcUrl,
        type: 'video/mp4'
      });

      if ($video720Url) sources.push({
        src: $video720Url,
        type: 'video/mp4'
      });

      if ($video360Url) sources.push({
        src: $video360Url,
        type: 'video/mp4'
      });

      if ($video240Url) sources.push({
        src: $video240Url,
        type: 'video/mp4'
      });

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

<p>$videoSrcUrl:{$videoSrcUrl}</p>
{#if $video720Url}
  <p>$video720Url:{$video720Url}</p>
{/if}
{#if $video360Url}
  <p>$video360Url:{$video360Url}</p>
{/if}
{#if $video240Url}
  <p>$video240Url:{$video240Url}</p>
{/if}

{#if typeof window === "undefined"}
  <div class="video-placeholder"></div>
{:else}
  <Plyr 
    on:timeupdate={logEvent}
    eventsToEmit={eventsToEmit}
    bind:player={player}
  >

    <video
      poster="{$thiccUrl}"
      src="{$videoSrcUrl}"
    >
      <source 
        src="{$videoSrcUrl}" 
        type="video/mp4"
        size="1080"
      >

      {#if $video720Url}
      <source 
        src="{$video720Url}" 
        type="video/mp4"
        size="720"
      >
      {/if}

      {#if $video360Url}
      <source 
        src="{$video360Url}" 
        type="video/mp4"
        size="360"
      >
      {/if}


      {#if $video240Url}
      <source 
        src="{$video240Url}" 
        type="video/mp4"
        size="240"
      >
      {/if}
    </video>

  </Plyr>

{/if}

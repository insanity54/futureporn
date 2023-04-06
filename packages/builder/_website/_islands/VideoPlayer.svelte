  
<script>
  import { defaultGateway } from "/@includes/js/store.js"
  import { onMount, onDestroy } from 'svelte'
  import { derived } from 'svelte/store'
  import { buildIpfsUrl } from "/@includes/js/common.js"
  import { blur } from 'svelte/transition'
  import Plyr from 'plyr'



  function logEvent(event) {
    console.log(event)
  }


  export let videoSrcHash = '';
  export let video720Hash = '';
  export let video360Hash = '';
  export let video240Hash = '';
  export let thiccHash = '';

  let eventsToEmit = ['timeupdate', 'stalled', 'error']



  $: videoSrcUrl = buildIpfsUrl($defaultGateway.pattern, videoSrcHash);
  $: video720Url = buildIpfsUrl($defaultGateway.pattern, video720Hash);
  $: video360Url = buildIpfsUrl($defaultGateway.pattern, video360Hash);
  $: video240Url = buildIpfsUrl($defaultGateway.pattern, video240Hash);
  $: thiccUrl = buildIpfsUrl($defaultGateway.pattern, thiccHash);

  let player

  onMount(async () => {
    const {default: Plyr} = await import('plyr')
    player = new Plyr('#player', {
      "quality": {
        "default": 240
      }
    })
    player.on('loadstart', (event) => {
      console.log('loadstart!')
      const instance = event.detail.plyr;
    });
    player.on('canplay', (event) => {
      console.log('canplay!')
      const instance = event.detail.plyr;
    });
    player.on('stalled', (event) => {
      console.log('stalled!')
      const instance = event.detail.plyr;
    });
    player.on('error', (event) => {
      console.error('error!')
      const instance = event.detail.plyr;
    });
  })


  // update the video player sources when the gateway is changed
  const unsub = defaultGateway.subscribe((gw) => {


    if (typeof player !== 'undefined' && typeof player.source !== 'undefined') {

      // we want to stop loading data from the previous gateway
      // so we destroy the player. maybe there's a better way to do this IDK
      // @todo

      let sources = []

      sources.push({
        src: 'https://stream.mux.com/ORtFf3I0202ECZz3k2Y4S3XyiiUxA2ivk6xqjjLYO14C8.m3u8',
        type: 'video/mux'
      })
//   if (!Hls.isSupported()) {
//     video.src = source;
//   } else {
//     // For more Hls.js options, see https://github.com/dailymotion/hls.js
//     const hls = new Hls();
//     hls.loadSource(source);
//     hls.attachMedia(video);
//     window.hls = hls;
    
//     // Handle changing captions
//     player.on('languagechange', () => {
//       // Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
//       setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
//     });
//   }
  
//   // Expose player so it can be used from the console
//   window.player = player;
// });

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

      player.source = {
        type: 'video',
        title: 'videoTitle',
        sources
      };
    }
  })


  onDestroy(unsub)

</script>

<style>
  .video-placeholder {
    background-color: purple;
    padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
  }
</style>

<slot></slot>


<video 
  style="--plyr-color-main: #353fff;"
  id="player"
  poster="{buildIpfsUrl($defaultGateway.pattern, thiccHash)}"
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



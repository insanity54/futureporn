import '../css/index.scss';

import Plyr from 'plyr';
new Plyr('#player');

import { create } from 'ipfs-core'
import Hls from 'hls.js'
import HlsjsIpfsLoader from 'hlsjs-ipfs-loader'

(async () => {
  if (window.ipfs === undefined) {
    const repoPath = 'ipfs-futureporn';
    const node = await create({
      repo: repoPath
    })
    handleInit(node)
  } else {
    window.ipfs.enable().then(handleInit)
  }

  function handleInit(node) {
    console.log('handleInit');
    console.log(node);
    //https://dweb.link/ipfs/bafybeiflu5ns2auqvqlpxqu2cqprmmn3gjgvxt72akd5kdbhnakyewcyhq?filename=projektmelody-chaturbate-20200606T000211Z-source.mp4
    const url = "https://dweb.link/ipfs/bafybeig6wi5nbi64bedu6lxkd7ddkgcnagblhds4wvcfux5crgfubv5avi"
    const filename = "projektmelody-chaturbate-2022-02-13.mp4"
    const testhash = "bafybeidhrsuwcuibaqoya4ufzgzjz3xiqj3otvkudv62rmnn3qjl6yb7sa";
    Hls.DefaultConfig.loader = HlsjsIpfsLoader;
    Hls.DefaultConfig.debug = true; //@todo change to false for deploy
    if (Hls.isSupported()) {
      const video = document.getElementById('player');
      const hls = new Hls();
      hls.config.ipfs = node;
      hls.config.ipfsHash = testhash;
      hls.loadSource(filename);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('lets play')
        video.play();
      });
      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log('video and hls.js are now bound together !');
        video.play();
      });
    }
  }
})()
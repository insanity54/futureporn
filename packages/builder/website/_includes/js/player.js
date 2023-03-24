import Plyr from 'plyr';


// // handler for the ipfs gateway selector
// document.addEventListener('DOMContentLoaded', () => {

//   // Get all "gateway-selector" elements
//   const $gatewaySelectors = Array.prototype.slice.call(document.querySelectorAll('.gateway-selector'), 0);

//   // Add a change event on each of them
//   $gatewaySelectors.forEach( el => {
//     el.addEventListener('change', (evt) => {


//       // set the url of the video player
//       const $videoSource = document.querySelector("#player > source:nth-child(1)")
//       const oldSrc = new URL($videoSource.src)
//       const newSrc = `https://${evt.target.value.replace(" (patrons only)", "")}${oldSrc.pathname}`
//       $videoSource.src = newSrc


//       // set the url of the download links

//       // Save the gateway preference to localstorage


//     });
//   });

// });

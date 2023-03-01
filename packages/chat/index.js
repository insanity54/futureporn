const fetch = require('node-fetch');
const seedrandom = require('seedrandom');
const millisecondsToHours = require('date-fns/millisecondsToHours')

channelName = process.argv[2] || 'projektmelody'

// greets ChatGPT
function generateRandomString(seed) {
  const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let random = new seedrandom(seed);
  return [...Array(11)].map(i => possibleCharacters[Math.floor(random() * possibleCharacters.length)]).join('');
}


async function getViewerCount(channelName, presenceId = generateRandomString(millisecondsToHours(Date.now()))) {
    const res = await fetch(`https://chaturbate.com/push_service/room_user_count/${channelName}/?presence_id=${presenceId}`, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": "1",
            "X-Requested-With": "XMLHttpRequest",
            "Alt-Used": "chaturbate.com",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": `https://chaturbate.com/${channelName}/`,
        "method": "GET",
        "mode": "cors"
    });
    const json = await res.json()

    if (!res.ok) throw new Error(`HTTP request was not OK! STATUS CODE-- ${res.status}`);
    return json
}


async function main () {
    const vc = await getViewerCount(channelName)
    console.log(vc)
}

main()
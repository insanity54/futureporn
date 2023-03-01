
const fetch = require('node-fetch');


async function readChat() {
	await fetch("wss://chatw-48.stream.highwebmedia.com/ws/150/xvzpfd0m/websocket", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Extensions": "permessage-deflate",
        "Sec-WebSocket-Key": "S/zsDSR85q/Fa12zDm5WLA==",
        "Sec-Fetch-Dest": "websocket",
        "Sec-Fetch-Mode": "websocket",
        "Sec-Fetch-Site": "cross-site",
        "Sec-GPC": "1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "method": "GET",
    "mode": "cors"
});

}


readChat()
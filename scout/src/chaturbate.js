import fetch from "node-fetch";
import seedrandom from "seedrandom";
import { millisecondsToHours } from 'date-fns'
import { EventEmitter } from "node:events";
import cheerio from "cheerio";
import Ably from 'ably';
import { Cookie, CookieJar } from "tough-cookie";
import { FileCookieStore } from "tough-cookie-file-store"; 
import os from 'os';
import path from 'path';
import FormData from 'form-data';


const datadir = path.join(os.homedir(), '.local/share/futureporn-scout')
const defaultRoomName = 'projektmelody';
const defaultRoomUid = 'G0TWFS5';
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
var jar = new CookieJar(new FileCookieStore(path.join(datadir, "cookie.json")));

// greets ChatGPT
export function getRandomNumberString(n) {
  let num = Math.floor(Math.random() * (10 ** n));
  return num.toString().padStart(n, '0');
}


// greets ChatGPT
function generateRandomString(seed) {
    const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random = new seedrandom(seed);
    return [...Array(11)].map(i => possibleCharacters[Math.floor(random() * possibleCharacters.length)]).join('');
}

export function chat(roomName) {
    class Chat extends EventEmitter {
        constructor(roomName = defaultRoomName) {
            super();
            this.roomName = roomName;
            this.socket = new SockJS();
        }
        listen() {
        }
    }
    let c = new Chat(roomName);
    c.listen();
}


export async function monitorRealtimeStatus (roomName, onStart, onStop) {
    const token = await getCsrfToken()
    const roomId = await getRoomId(roomName)
    const auth = await getPushServiceAuth(token, roomName, roomId)
    const statusChannelString = auth.channels[`RoomStatusTopic#RoomStatusTopic:${roomId}`]
    const realtime = await getRealtime(token, auth.token_request, auth.settings.realtime_host, auth.settings.fallback_hosts)
    realtime.connection.once('connected', (idk) => {
        console.log(`  [*] CB Realtime Connected! ${JSON.stringify(idk, 0, 2)}`)
    })
    const statusChannel = realtime.channels.get(statusChannelString);
    statusChannel.subscribe((message) => {
        if (message.data.status === 'public') {
            onStart(message)
        } else if (message.data.status === 'offline') {
            onStop(message)
        }
        console.log(`Received room:status:<roomId>:0`)
        console.log(JSON.stringify(message, 0, 2));
    });
    await realtime.connect()
}

export async function getRoomId (room) {
    const dossier = await getInitialRoomDossier(room)
    return dossier.room_uid
}

export async function getRandomRoom () {
    const res = await fetch('https://chaturbate.com/')
    const body = await res.text()
    const $ = cheerio.load(body)
    let roomsRaw = $('a[data-room]')
    let rooms = []
    $(roomsRaw).each((_, e) => {
        rooms.push($(e).attr('href'))
    })

    // greets https://stackoverflow.com/a/4435017/1004931
    var randomIndex = Math.floor(Math.random() * rooms.length);
    return rooms[randomIndex].replaceAll('/', '')
}

export async function getInitialRoomDossier(roomName = defaultRoomName) {
    const res = await fetch(`https://chaturbate.com/${roomName}`);
    const body = await res.text();
    // console.log(body);
    const $ = cheerio.load(body);
    let rawScript = $('script:contains(window.initialRoomDossier)').html();
    if (!rawScript) throw new Error('window.initialRoomDossier is null. This could mean the channel is in password mode')
    let rawDossier = rawScript.slice(rawScript.indexOf('"'), rawScript.lastIndexOf('"')+1)
    let dossier = JSON.parse(JSON.parse(rawDossier));
    return dossier
    // dossier.wschat_host contains the chat websocket url
}

export async function getViewerCount(roomName = defaultRoomName, presenceId = generateRandomString(millisecondsToHours(Date.now()))) {
    const res = await fetch(`https://chaturbate.com/push_service/room_user_count/${roomName}/?presence_id=${presenceId}`, {
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
        "referrer": `https://chaturbate.com/${roomName}/`,
        "method": "GET",
        "mode": "cors"
    });
    const json = await res.json();
    if (!res.ok)
        throw new Error(`HTTP request was not OK! STATUS CODE-- ${res.status}`);
    return json?.count;
}


/**
 * make a request against CB's server which
 *   - verifies custom credentials
 *   - issues signed Ably TokenRequest
 * 
 * more info-- https://ably.com/docs/core-features/authentication#token-authentication
 */
export async function getPushServiceAuth(csrfToken, roomName = defaultRoomName, roomUid = defaultRoomUid) {
    let form = new FormData();
    const topics = `{
        "RoomTipAlertTopic#RoomTipAlertTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },
        "RoomPurchaseTopic#RoomPurchaseTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },
        "RoomFanClubJoinedTopic#RoomFanClubJoinedTopic:${roomUid}": {
            "broadcaster_uid":"${roomUid}"
        },
        "RoomMessageTopic#RoomMessageTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },
        "GlobalPushServiceBackendChangeTopic#GlobalPushServiceBackendChangeTopic":{
        },
        "RoomAnonPresenceTopic#RoomAnonPresenceTopic:${roomUid}":{\
            "broadcaster_uid":"${roomUid}"
        },
        "QualityUpdateTopic#QualityUpdateTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomNoticeTopic#RoomNoticeTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomEnterLeaveTopic#RoomEnterLeaveTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomPasswordProtectedTopic#RoomPasswordProtectedTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomModeratorPromotedTopic#RoomModeratorPromotedTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomModeratorRevokedTopic#RoomModeratorRevokedTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomStatusTopic#RoomStatusTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomTitleChangeTopic#RoomTitleChangeTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomSilenceTopic#RoomSilenceTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomKickTopic#RoomKickTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomUpdateTopic#RoomUpdateTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        },"RoomSettingsTopic#RoomSettingsTopic:${roomUid}":{
            "broadcaster_uid":"${roomUid}"
        }
    }`

    

    form.append('topics', topics)
    form.append('csrfmiddlewaretoken', csrfToken)
    const res = await fetch("https://chaturbate.com/push_service/auth/", {
        "credentials": "include",
        "headers": {
            "User-Agent": ua,
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": "1"
        },
        "referrer": `https://chaturbate.com/${roomName}/`,
        "body": form,
        "method": "POST",
        "mode": "cors"
    });


    const json = await res.json()
    return json
}
export async function getRealtime(csrfToken, tokenRequest, realtimeHost, fallbackHosts) {
    const realtime = new Ably.Realtime.Promise({
        autoConnect: false,
        closeOnUnload: true,
        transportParams: {
            remainPresentFor: '0'
        },
        realtimeHost: realtimeHost,
        restHost: realtimeHost,
        fallback_hosts: fallbackHosts,
        authCallback: ((tokenParams, cb) => {
            // console.log(`   >>> authCallback I don't actually have antyhing i just wanted to see the tokenParams`)
            // console.log(tokenParams)
            // console.log(tokenRequest)

            cb(null, tokenRequest)
        })
    })




    return realtime

}



export function getTokenCookie (cookies) {
    return cookies.find((c) => c.key == 'csrftoken');
}

export async function getCsrfToken(roomName = defaultRoomName) {
    const cbUrl = 'https://chaturbate.com/';
    let cookies = await jar.getCookies(cbUrl);
    let tokenCookie = getTokenCookie(cookies);
    
    if (typeof tokenCookie === 'undefined') {

        let res = await fetch(cbUrl, {
            "credentials": "omit",
            "headers": {
                "User-Agent": ua,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1"
            },
            "method": "GET",
            "mode": "cors"
        });

        const rawHeaders = res.headers.raw()

        if (Array.isArray(rawHeaders["set-cookie"]))
          cookies = rawHeaders["set-cookie"].map(Cookie.parse);
        else cookies = [Cookie.parse(rawHeaders["set-cookie"])];
    
        tokenCookie = getTokenCookie(cookies)
        if (typeof tokenCookie === 'undefined') throw new Error(` could not find csrftoken cookie! ${JSON.stringify(cookies)}`)

        try {
            await jar.setCookie(tokenCookie, cbUrl)
        } catch (e) {
            console.error(`problem while setting cookie on disk. ${e}`)
            console.error(e)
        }
    }

    return tokenCookie.value

}

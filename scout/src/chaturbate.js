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
  return ''+Math.floor(Math.random() * 10 ** n);
}

// greets ChatGPT
function generateRandomString(seed) {
    const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let random = new seedrandom(seed);
    return [...Array(11)].map(i => possibleCharacters[Math.floor(random() * possibleCharacters.length)]).join('');
}
// this._transUrl = info.base_url ? info.base_url : this.url;
//                wss://chatw-51.stream.highwebmedia.com/ws/322/knhfu313/websocket
// var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
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
export async function getInitialRoomDossier(roomName = defaultRoomName) {
    const res = await fetch(`https://chaturbate.com/${roomName}`);
    const body = await res.text();
    // console.log(body);
    const $ = cheerio.load(body);
    let rawScript = $('script:contains(window.initialRoomDossier)').html();
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
export async function pushServiceAuth(csrfToken, roomName = defaultRoomName, roomUid = defaultRoomUid) {
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
export async function requestRealtimeToken(csrfToken, tokenRequest, realtimeHost, fallbackHosts) {




    // const res = await fetch(`https://${realtimeHost}/keys/${keyName}/requestToken?rnd=${randomNumber}`, {
    //     "credentials": "omit",
    //     "headers": {
    //         "User-Agent": ua,
    //         "Accept": "application/json",
    //         "Accept-Language": "en-US,en;q=0.5",
    //         "content-type": "application/json",
    //         "X-Ably-Version": "1.2",
    //         "Ably-Agent": "ably-js/1.2.13 browser",
    //         "Sec-Fetch-Dest": "empty",
    //         "Sec-Fetch-Mode": "cors",
    //         "Sec-Fetch-Site": "cross-site",
    //         "Sec-GPC": "1"
    //     },
    //     "referrer": "https://chaturbate.com/",
    //     "body": JSON.stringify(body),
    //     "method": "POST",
    //     "mode": "cors"
    // });
    
    // const json = await res.json()
    // console.log(auth.token_request)




    // basic auth with an API key
    // var client = new Ably.Realtime(keyName);

    // using a Client Options object, see https://www.ably.com/docs/rest/usage#client-options
    // which must contain at least one auth option, i.e. at least
    // one of: key, token, tokenDetails, authUrl, or authCallback

    // var ablyRest = new Ably.Rest({ 
    //     environment: realtime_host,
    //     fallbackHosts: fallback_hosts,
    //     token: auth.token_request,
    //     authUrl: `https://${realtime_host}/keys/${keyName}/requestToken?rnd=${randomNumber}`,
    //     authMethod: 'POST',
    // });


    const realtime = new Ably.Realtime.Promise({
        autoConnect: false,
        closeOnUnload: true,
        transportParams: {
            remainPresentFor: '0'
        },
        realtimeHost: realtimeHost,
        restHost: realtimeHost,
        fallback_hosts: fallbackHosts,
        // realtimeHost: 'realtime.pa.highwebmedia.com',
        // restHost: 'realtime.pa.highwebmedia.com',
        // fallbackHosts: [
        //     "a-fallback.pa.highwebmedia.com",
        //     "b-fallback.pa.highwebmedia.com",
        //     "c-fallback.pa.highwebmedia.com",
        //     "d-fallback.pa.highwebmedia.com",
        //     "e-fallback.pa.highwebmedia.com"
        // ],
        // authUrl: 'https://chaturbate.com/push_service/auth/',
        // authMethod: 'POST',
        
        authCallback: ((tokenParams, cb) => {
            console.log(`   >>> authCallback I don't actually have antyhing i just wanted to see the tokenParams`)
            console.log(tokenParams)
            console.log(tokenRequest)

            cb(null, tokenRequest)

            // pushServiceAuth(csrfToken).then((auth) => {
            //     const { keyName, ttl, nonce, capability, timestamp, mac } = auth.token_request;
            //     const { realtime_host, fallback_hosts } = auth.settings;
            //     const { client_id } = auth;
            //     cb(null, auth.token_request)
            // }).catch((err) => {
            //     cb(err, null)
            // })
        })
    })




    return realtime

    // console.log(client)

    // // // For a version of the library where async methods return promises if
    // // // you don't pass a callback:
    // // var client = new Ably.Realtime.Promise(options: string | ClientOptions);

    // // // For the explicitly-callback-based variant (see 'Async API style' below):
    // // var client = new Ably.Rest.Callbacks(options: string | ClientOptions);

    
    // return client
}
export async function getRealtime(roomName = defaultRoomName) {
    // @TODO
    // 1) get a csrftoken (cookie) by GET request at /projektmelody
    // 2) POST /push_service/auth with form-data topics and form-data csrfmiddlewaretoken in order to recieve realtime_host URL, 
    //    fallback_hosts URLs, and token_request keyName.
    // 3) POST https://realtime.pa.highwebmedia.com/keys/${keyName}/requestToken?rnd=${random.number(16)} to get a token
    // 3) GET wss://realtime.pa.highwebmedia.com/?access_token=KSKw2g.AL36ISgpwjjW7K8fAWu4LCBbjv1J_sCC6G5_IiuCaSMM8UrvKU&upgrade=86fAuDl_wBJfcg!PviQE7EMeWH4gqAO-40e2&format=json&heartbeats=true&v=1.2&agent=ably-js%2F1.2.13%20browser&remainPresentFor=0 to get a websocket connection which will give us realtime updates
    let realtime = await getAblyEvents()
    
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

// wss://realtime.pa.highwebmedia.com/?access_token=KSKw2g.AL36ISgtMkCiuAjjt6Y8KDPUQPp7KZZm54eWfSG-6j8vwVP7fM&upgrade=86fl8-f6wBJcGt!G3jqZK259OK5CKfa-887af&format=json&heartbeats=true&v=1.2&agent=ably-js/1.2.13 browser&remainPresentFor=0

// here's the event we're interested in
// let's hear directly from CB when Mel is live!
//
// {
// 	"action": 15,
// 	"id": "F-0ZurKr5P:0",
// 	"connectionSerial": 180,
// 	"channel": "room:status:Y8WX995:0",
// 	"channelSerial": "86fyoBzKwBJeTo63853136:31",
// 	"timestamp": 1672268208577,
// 	"messages": [
// 		{
// 			"encoding": "json",
// 			"data": "{\"tid\": \"16722682085:668\", \"ts\": 1672268208.559817, \"status\": \"offline\", \"message\": \"\", \"hash\": \"\", \"pub_ts\": 1672268208.5606508, \"method\": \"single\"}",
// 			"name": "room:status:Y8WX995:0"
// 		}
// 	]
// }
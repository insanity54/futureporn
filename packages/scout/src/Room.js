import {
  getRoomId
} from './chaturbate.js'
import fetch from "node-fetch";
import cheerio from "cheerio";
import {
  Cookie,
  CookieJar
} from "tough-cookie";
import {
  FileCookieStore
} from "tough-cookie-file-store";
import os from 'os';
import path from 'path';
import {
  loggerFactory
} from 'common/logger'
import {
  isBefore
} from 'date-fns'
import Ably from 'ably';
import {
  FormData
} from 'formdata-polyfill/esm.min.js'


const logger = loggerFactory({
  defaultMeta: {
    service: "futureporn/scout"
  }
})

export default class Room {
  constructor(opts) {
    this.roomName = opts.roomName
    this.roomId = opts.roomId || null
    this.roomUrl = 'https://chaturbate.com/' + this.roomName
    this.csrfToken = null
    this.tokenRequest = null
    this.ablyTokenRequest = null
    this.dossier = null
    this.realtimeHost = null
    this.fallbackHosts = null
    this.pushServiceAuth = null
    this.datadir = path.join(os.homedir(), '.local/share/futureporn/scout')
    this.cookieJar = new CookieJar(new FileCookieStore(path.join(this.datadir, "cookie.json")));
    this.ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
    this.onStart = opts.onStart || null;
    this.onStop = opts.onStop || null;
    this.realtime = null;
  }


  async getRoomId() {
    if (this.roomId !== '') {
      return this.roomId
    } else {
      return await getRoomId(this.roomName);
    }
  }

  async getInitialRoomDossier() {
    const res = await fetch(this.roomUrl);
    const body = await res.text();
    const $ = cheerio.load(body);
    let rawScript = $('script:contains(window.initialRoomDossier)').html();
    if (!rawScript) throw new Error('window.initialRoomDossier is null. This could mean the channel is in password mode')
    let rawDossier = rawScript.slice(rawScript.indexOf('"'), rawScript.lastIndexOf('"') + 1)
    let dossier = JSON.parse(JSON.parse(rawDossier));
    return dossier
      // dossier.wschat_host contains the chat websocket url
  }



  static getPermissionsForm(roomId, csrfToken) {
    let form = new FormData();
    const topics = `{
          "RoomTipAlertTopic#RoomTipAlertTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },
          "RoomPurchaseTopic#RoomPurchaseTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },
          "RoomFanClubJoinedTopic#RoomFanClubJoinedTopic:${roomId}": {
              "broadcaster_uid":"${roomId}"
          },
          "RoomMessageTopic#RoomMessageTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },
          "GlobalPushServiceBackendChangeTopic#GlobalPushServiceBackendChangeTopic":{
          },
          "RoomAnonPresenceTopic#RoomAnonPresenceTopic:${roomId}":{\
              "broadcaster_uid":"${roomId}"
          },
          "QualityUpdateTopic#QualityUpdateTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomNoticeTopic#RoomNoticeTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomEnterLeaveTopic#RoomEnterLeaveTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomPasswordProtectedTopic#RoomPasswordProtectedTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomModeratorPromotedTopic#RoomModeratorPromotedTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomModeratorRevokedTopic#RoomModeratorRevokedTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomStatusTopic#RoomStatusTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomTitleChangeTopic#RoomTitleChangeTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomSilenceTopic#RoomSilenceTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomKickTopic#RoomKickTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomUpdateTopic#RoomUpdateTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          },"RoomSettingsTopic#RoomSettingsTopic:${roomId}":{
              "broadcaster_uid":"${roomId}"
          }
      }`
    form.append('topics', topics)
    form.append('csrfmiddlewaretoken', csrfToken)
    return form
  }


  async monitorRealtime () {
    if (!this.onStart) throw new Error('onStart option callback must be defined when running monitorRealtime()');
    if (!this.onStart) throw new Error('onStop option callback must be defined when running monitorRealtime()');


    if (!this.pushServiceAuth) this.pushServiceAuth = await this.getPushServiceAuth();
    if (!this.roomId) this.roomId = await this.getRoomId();

    const statusChannelString = this.pushServiceAuth.channels[`RoomStatusTopic#RoomStatusTopic:${this.roomId}`]
    this.realtime = await this.getRealtime()
    this.realtime.connection.once('connected', (idk) => {
        logger.log({ level: 'info', message: 'CB Realtime Connected!' })
    })
    const statusChannel = this.realtime.channels.get(statusChannelString);
    statusChannel.subscribe((message) => {
        if (message.data.status === 'public') {
            this.onStart(message)
        } else if (message.data.status === 'offline') {
            this.onStop(message)
        }
        logger.log({ level: 'debug', message: `Received room:status:<roomId>:0` })
        logger.log({ level: 'debug', message: JSON.stringify(message, 0, 2) })
    });
    await this.realtime.connect()
  }


  /**
   * make a request against CB's server which
   *   - verifies custom credentials
   *   - issues signed Ably TokenRequest
   * 
   * The response contains the following
   *   - token
   *   - channels
   *   - failures
   *   - token_request <-- Ably TokenRequest
   *   - client_id
   *   - settings
   *
   * GET https://chaturbate.com/push_service/auth/
   *  
   * more info-- https://ably.com/docs/core-features/authentication#token-authentication
   */
  async getPushServiceAuth () {


    // if we have a valid tokenRequest, just return that.
    const tokenRequestTimestamp = this.pushServiceAuth?.token_request?.timestamp
    const tokenRequestTtl = this.pushServiceAuth?.token_request?.ttl

    if (
      typeof tokenRequestTtl !== 'undefined' && 
      typeof tokenRequestTimestamp !== 'undefined'
    ) {
      const tokenRequestExpiration = tokenRequestTimestamp+tokenRequestTtl
      if (
        isBefore(
          new Date(),
          tokenRequestExpiration
        )
      ) {
        return this.pushServiceAuth
      }
    }

  
    logger.log({
      level: 'debug',
      message: `Ably TokenRequest is either absent or expired. Let's get a new one.`
    })


    this.csrfToken = await this.getCsrfToken()
    this.roomId = await this.getRoomId()
    const form = Room.getPermissionsForm(this.roomId, this.csrfToken)
    const res = await fetch("https://chaturbate.com/push_service/auth/", {
      "credentials": "include",
      "headers": {
        "User-Agent": this.ua,
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-GPC": "1"
      },
      "referrer": this.roomUrl,
      "body": form,
      "method": "POST",
      "mode": "cors"
    });
    this.pushServiceAuth = await res.json()

    // logger.log({
    //   level: 'debug',
    //   message: JSON.stringify(this.pushServiceAuth)
    // })
    return this.pushServiceAuth
  }

  async getRoomId() {
    if (this.roomId) return this.roomId;
    this.dossier = await this.getInitialRoomDossier()
    this.roomId = this.dossier.room_uid
    return this.roomId
  }

  async getTokenRequest() {
    this.pushServiceAuth = await this.getPushServiceAuth()
    return this.pushServiceAuth.token_request
  }

  async getRealtime() {
    // deps
    // csrfToken, tokenRequest, realtimeHost, fallbackHosts

    if (!this.realtimeHost || !this.fallbackHosts) {
      this.pushServiceAuth = await this.getPushServiceAuth()
      this.realtimeHost = this.pushServiceAuth.settings.realtime_host
      this.fallbackHosts = this.pushServiceAuth.settings.fallback_hosts
    }

    const realtime = new Ably.Realtime.Promise({
        autoConnect: false,
        closeOnUnload: true,
        transportParams: {
          remainPresentFor: '0'
        },
        realtimeHost: this.realtimeHost,
        restHost: this.realtimeHost,
        fallback_hosts: this.fallbackHosts,
        authCallback: (async (tokenParams, cb) => {
          logger.log({ level: 'debug', message: `Ably authCallback. Getting a fresh new Ably TokenRequest.`})
          this.tokenRequest = await this.getTokenRequest()
          logger.log({ level: 'debug', message: `Got a new TokenRequest`})

          cb(null, this.tokenRequest)
        })
      })

      return realtime

    }

    static getTokenCookie(cookies) {
      return cookies.find((c) => c.key == 'csrftoken');
    }

    async getCsrfToken() {
      let cookies = await this.cookieJar.getCookies(this.roomUrl);
      let tokenCookie = Room.getTokenCookie(cookies)
      if (
        typeof tokenCookie === 'undefined' ||
        isBefore(tokenCookie.expires, new Date())
      ) {
        logger.log({
          level: 'debug',
          message: 'tokenCookie is either undefined or expired. Getting new cookie.'
        })
        let res = await fetch(this.roomUrl, {
          "credentials": "omit",
          "headers": {
            "User-Agent": this.ua,
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

        tokenCookie = Room.getTokenCookie(cookies)
        if (typeof tokenCookie === 'undefined') throw new Error(` could not find csrftoken cookie! ${JSON.stringify(cookies)}`)

        try {
          await this.cookieJar.setCookie(tokenCookie, this.roomUrl)
        } catch (e) {
          logger.log({
            level: 'error',
            message: `problem while setting cookie on disk. ${e}`
          })
          logger.log({
            level: 'error',
            message: JSON.stringify(e)
          })
        }
      }

      return tokenCookie.value

    }


  }
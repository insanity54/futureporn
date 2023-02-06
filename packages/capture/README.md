# Capture

## Dev notes

### youtube-dl end of stream output

```
[https @ 0x5646887f1580] Opening 'https://edge11-lax.live.mmcdn.com/live-hls/amlst:hotfallingdevil-sd-fdf87e5b6c880e52d38e8c94f8ebf8728c980a91d56fb4ace13748ba59012336_trns_h264/chunklist_w881713853_b5128000_t64RlBTOjMwLjA=.m3u8' for reading
[hls @ 0x564687dd0980] Skip ('#EXT-X-VERSION:4')
[hls @ 0x564687dd0980] Skip ('#EXT-X-DISCONTINUITY-SEQUENCE:0')
[hls @ 0x564687dd0980] Skip ('#EXT-X-PROGRAM-DATE-TIME:2023-01-31T17:48:45.947+00:00')
[https @ 0x5646880bf880] Opening 'https://edge11-lax.live.mmcdn.com/live-hls/amlst:hotfallingdevil-sd-fdf87e5b6c880e52d38e8c94f8ebf8728c980a91d56fb4ace13748ba59012336_trns_h264/media_w881713853_b5128000_t64RlBTOjMwLjA=_18912.ts' for reading
[https @ 0x564688097d00] Opening 'https://edge11-lax.live.mmcdn.com/live-hls/amlst:hotfallingdevil-sd-fdf87e5b6c880e52d38e8c94f8ebf8728c980a91d56fb4ace13748ba59012336_trns_h264/media_w881713853_b5128000_t64RlBTOjMwLjA=_18913.ts' for reading
[https @ 0x5646887f1580] Opening 'https://edge11-lax.live.mmcdn.com/live-hls/amlst:hotfallingdevil-sd-fdf87e5b6c880e52d38e8c94f8ebf8728c980a91d56fb4ace13748ba59012336_trns_h264/chunklist_w881713853_b5128000_t64RlBTOjMwLjA=.m3u8' for reading
[https @ 0x5646886e8580] HTTP error 403 Forbidden
[hls @ 0x564687dd0980] keepalive request failed for 'https://edge11-lax.live.mmcdn.com/live-hls/amlst:hotfallingdevil-sd-fdf87e5b6c880e52d38e8c94f8ebf8728c980a91d56fb4ace13748ba59012336_trns_h264/chunklist_w881713853_b5128000_t64RlBTOjMwLjA=.m3u8' with error: 'Server returned 403 Forbidden (access denied)' when parsing playlist
[https @ 0x5646886ccfc0] HTTP error 403 Forbidden
[hls @ 0x564687dd0980] Failed to reload playlist 0
[https @ 0x5646886bf680] HTTP error 403 Forbidden
[hls @ 0x564687dd0980] Failed to reload playlist 0
frame= 5355 fps= 31 q=-1.0 Lsize=   71404kB time=00:02:58.50 bitrate=3277.0kbits/s speed=1.02x    
video:68484kB audio:2790kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.181873%
[ffmpeg] Downloaded 73117881 bytes
[download] 100% of 69.73MiB in 02:57
```
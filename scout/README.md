# scout


## Dev notes

### Ably realtime event formats


#### room:notice:<roomId>

```json
{
  "name": "room:notice:6DDY7ZC",
  "id": "u-Y6UQ8JV3:0:0",
  "encoding": null,
  "data": {
    "tid": "16755044232:9830",
    "ts": 1675504423.225136,
    "messages": [
      " %%%[emoticon stwad2|https://static-pub.highwebmedia.com/uploads/avatar/2022/11/26/01/46/adec68059ed40d9dbb78260c9a46871c8c2070c4.jpg|76|78|/emoticon_report_abuse/stwad2/]%%% skinny_sis's Spin the Wheel ",
      " Tip 33 tokens and you can win one of the 12 prizes ",
      " Chance of winning: 67%. Type /wheel for the prizes "
    ],
    "to_user": "",
    "notice_type": "app",
    "foreground": "rgb(103,77,255)",
    "background": null,
    "weight": "bolder",
    "method": "lazy",
    "pub_ts": 1675504423.230338
  }
}
```


#### room:title_change:<roomId>

```json
{
  "name": "room:title_change:6DDY7ZC",
  "id": "vAj6M1bn9D:0:0",
  "encoding": null,
  "data": {
    "tid": "16755100793:8346",
    "ts": 1675510079.3160765,
    "title": "❤️CUM SHOW❤️ Pvt is open 30per/min [1386 tokens left] #bigboobs #teen #18 #new #asian",
    "pub_ts": 1675510079.3162484,
    "method": "single"
  }
}
```

#### room:update:<roomId>

```json
{
  "name": "room:update:6DDY7ZC",
  "id": "meLVS3wTan:0:0",
  "encoding": null,
  "data": {
    "tid": "16755100794:436",
    "ts": 1675510079.4469855,
    "target": "refresh_panel",
    "target_user": "",
    "pub_ts": 1675510079.4471552,
    "method": "single"
  }
}
```

#### room:status:<roomId>:0

```json
{
  "name": "room:status:ZF09ZAC:1",
  "id": "cCs6ThzT-p:0:0",
  "encoding": null,
  "data": {
    "tid": "16755114015:96114",
    "ts": 1675511401.588585,
    "status": "away",
    "message": "",
    "hash": "",
    "method": "lazy",
    "pub_ts": 1675511401.5939016
  }
}

{
  "name": "room:status:ZF09ZAC:1",
  "id": "Zk1EF44xrP:0:0",
  "encoding": null,
  "data": {
    "tid": "16755114435:80861",
    "ts": 1675511443.533211,
    "status": "public",
    "message": "",
    "hash": "",
    "pub_ts": 1675511443.5339801,
    "method": "single"
  }
}
```


#### room:update:<roomId>

```json
{
  "name": "room:update:ZF09ZAC",
  "id": "vOqwMouvAB:0:0",
  "encoding": null,
  "data": {
    "tid": "16755118892:73991",
    "ts": 1675511889.2104225,
    "target": "refresh_panel",
    "target_user": "",
    "pub_ts": 1675511889.2105591,
    "method": "single"
  }
}
```


#### room:status:<roomId>:0

```json
{
  "name": "room:status:ZF09ZAC:1",
  "id": "gs04uEHZTV:0:0",
  "encoding": null,
  "data": {
    "tid": "16755147455:43279",
    "ts": 1675514745.5818536,
    "status": "offline",
    "message": "",
    "hash": "",
    "pub_ts": 1675514745.5831933,
    "method": "single"
  }
}
```

#### 
#!/bin/bash

# checklist.sh
#
# Futureporn checklist
# This is a checklist to help me ensure that I do everything necessary
# after a new vod is created.
# This idea borrows from 
# [Do-nothing scripting: the key to gradual automation](https://blog.danslimmon.com/2019/07/15/do-nothing-scripting-the-key-to-gradual-automation/)
# [HN Thread](https://news.ycombinator.com/item?id=29083367)


echo "Futureporn checklist.sh"
echo "This is a process checklist of tasks that must be completed after a new VOD is created."
echo "Press [Enter] to complete a task."
echo ""

echo "[TASK] Open Portal"
echo "  ex: xdg-open https://portal.futureporn.net/admin"
read

echo "[TASK] add date, announceUrl, announceTitle, title to Portal"
read

echo "[TASK] add the file to ipfs"
echo "  ex: ipfs add --cid-version=1 ./file.mp4"
read

echo "[TASK] add videoSrcHash to Portal"
read

echo "[TASK] backup the file to B2"
echo "  ex: b2-linux upload-file futureporn ./file.mp4 file.mp4"
read

echo "[TASK] add B2 URL to Portal (videoSrc)"
read

echo "[TASK] publish VOD on Portal"
read

echo "[TASK] Trigger a website build"
echo "  ex: https://app.fleek.co/#/sites/futureporn/deploys?accountId=insanity54-team"
read

echo "[TASK] Take a break"
echo "  ex: walk"
echo "  ex: sleep"
echo "  ex: eat"
read

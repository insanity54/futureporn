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

echo "[TASK] add the file to ipfs"
echo "  ex: ipfs add --cid-version=1 ./file.mp4"
read

echo "[TASK] add the CID to the cluster"
echo "  ex: ipfs-cluster-ctl pin add <CID>"
read

echo "[TASK] backup the file to B2"
echo "  ex: b2-linux upload-file futureporn ./file.mp4 file.mp4"
read

echo "[TASK] add the videoSrcHash,title,tags,annouceTitle,announceUrl,etc. to the db (pgAdmin)"
echo "  use: pgAdmin"
read

echo "[TASK] Build the site"
echo "  ex: git checkout main"
echo "      pn run build"
echo "  @todo: NOTIFY ???/upload to trigger 'futureporn/builder' to build"
read

echo "[TASK] publish"
echo "  ex: git add _site/"
echo '      git commit -m "update"'
echo "      git push origin main"
read




echo "[TASK] Take a break"
echo "  ex: walk"
echo "  ex: sleep"
echo "  ex: eat"
read
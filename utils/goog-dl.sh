#!/bin/bash

# Download a large file from Google using the CLI
# greets https://medium.com/@acpanjan/download-google-drive-files-using-wget-3c2c025a8b99


FILEID="${1}"
FILENAME="${2}"


if [ -z ${FILEID} ]; then
  ekko "First param must be a file ID, but the first param was empty."
  exit 6
fi

if [ -z ${FILENAME} ]; then
  ekko "Secpmd param must be a filename, but the first param was empty."
  exit 7
fi

wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate "https://docs.google.com/uc?export=download&id=$FILEID" -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=$FILEID" -O $FILENAME && rm -rf /tmp/cookies.txt



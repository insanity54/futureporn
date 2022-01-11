#!/bin/bash

## Loading variables from .env files in Ansible
## Greets https://gist.github.com/berkayunal/ccb1c3511f02d41b7654de17bced30b7

set -o nounset -o pipefail -o errexit

# Load all variables from .env and export them all for Ansible to read
set -o allexport
source "$(dirname "$0")/.env"
set +o allexport

# Run Ansible
exec ansible-playbook "$@"


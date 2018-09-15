#!/usr/bin/env bash 

set -e;

INSTANCE_NAME="portainer";

sudo mkdir -p /mnt/data/${INSTANCE_NAME};

sudo chown $USER:$USER /mnt/data/${INSTANCE_NAME};

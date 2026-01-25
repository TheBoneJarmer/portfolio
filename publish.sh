#!/bin/bash

TAG="ghcr.io/thebonejarmer/portfolio"

sudo docker build -t $TAG .
sudo docker push $TAG

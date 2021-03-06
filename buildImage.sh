#!/bin/bash
set -e

imageTag=$1
if [ -z "$1" ]
  then
    echo No image tag provided. latest will be used
    imageTag=latest
fi

cd backend
./buildImage.sh $imageTag
cd ../frontend
./buildImage.sh $imageTag
cd ..
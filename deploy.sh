#!/usr/bin/env bash
set -euo pipefail

rm -rf dists/
make -j --keep-going --output-sync=target

pushd dists/

git init
git switch -c main
git config user.name "SeongChan Lee"
git config user.email "foriequal0@gmail.com"
git add -A
git commit -m "Deploy"
git push -f git@github.com:foriequal0/utils.git main:gh-pages

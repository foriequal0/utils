#!/usr/bin/env bash
set -euo pipefail

git switch gh-pages
git merge --no-ff main
if [ -d dists ]; then
  rm -rf dists/
  git rm -rf dists/
fi
make -j --keep-going --output-sync=target
git add --force dists/
git commit -m "deploy"
git push -u origin gh-pages
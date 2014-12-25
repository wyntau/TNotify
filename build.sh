#!/bin/bash

if [ `which uglifyjs` = "" ]; then
  echo '请先使用npm 安装`uglifyjs`'
  echo
  echo '  npm install -g uglifyjs'
  echo
  exit
fi;
# minify js
uglifyjs --verbose --mangle --define "angular" tnotify.js -o tnotify.min.js


if [ `which uglifycss` = "" ]; then
  echo '请先使用npm 安装`uglifycss`'
  echo
  echo '  npm install -g uglifycss'
  echo
  exit
fi;
# minify css
uglifycss tnotify.css > tnotify.min.css

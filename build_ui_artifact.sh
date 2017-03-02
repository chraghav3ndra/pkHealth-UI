#!/bin/bash

npm install
bower install
gulp build
rm -f edp-ui/edp-ui-setup/*
cp -r dist/* edp-ui/edp-ui-setup/


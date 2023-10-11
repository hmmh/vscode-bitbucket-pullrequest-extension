#!/bin/bash

# This script is used to release a new version of the project.

# get version from package.json
version=$(node -p -e "require('./package.json').version")
# create tag with version
git tag -a $version -m "Release $version"
# push tag to github
git push origin $version
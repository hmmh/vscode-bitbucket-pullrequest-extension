#!/bin/bash

# This script is used to release a new version of the project.

# get version from package.json
version=$(node -p -e "require('./package.json').version")

# show prompt for inserting release notes
read -p "Release Notes: " release_notes

# create tag with version
git tag -a $version -m "Release $version\n\n$release_notes"

# push tag to github
git push origin $version
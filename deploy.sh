#!/bin/bash


version=$(npm version patch)
npm run build 

cd build/

cp config.prd.json config.tmp.json
mv config.json config.dev.json
mv config.prd.json config.json
sed -i.bak s/VERSION_TAG/$version/g config.json

cd ..

aws s3 cp build s3://ul-management/ --recursive

cd build/

mv config.tmp.json config.prd.json
mv config.dev.json config.json
rm -f config.tmp.json

cd ..

git push


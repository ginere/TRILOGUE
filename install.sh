#!/bin/bash

TRUE=0
FALSE=1

function test(){
	local value="$1";
	local message="$2";

	if [ "$value" != "$TRUE" ] ; then
		echo ERROR: $message code:$value;
		exit  $FALSE;
	fi
}

echo 1/ cleaning ...
find . -name \*~ -print -type f -exec rm {} \; ; find . -name .DS_Store -print -type f -exec rm {} \; ; find . -name \#\*\# -print -type f -exec rm {} \;

# grunt clear;
export NODE_PRODUCTION=true

echo 1/ Gulp dist
gulp dist
test "$?" "grunt clean";

echo 2/ git add --all .
git add --all .
test "$?" "git add --all";

echo 3/ git commit -a --allow-empty -m "" --allow-empty-message
git commit -a --allow-empty -m "" --allow-empty-message
test "$?" "git commit";

echo 4/ git push origin master
git push origin master
test "$?" "git push origin master";

echo 5/ git fetch origin
git fetch origin
test "$?" "git fetch origin";

echo 6/ git merge origin/master
git merge origin/master
test "$?" "git merge origin/master";


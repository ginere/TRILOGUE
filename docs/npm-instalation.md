# This explain how to create the nom installation


* Use this to update your npm current installation:
```
npm update -g 
```

* To update a package
```
npm update -g PACKAGE
```

* Init the current project

```
npm init 
```
* Update the /package.json


## Add the developpement dependencies

Execute :
```
npm install --save-dev gulp

npm install --save-dev del
npm install --save-dev jshint gulp-jshint

npm install --save-dev gulp-if
npm install --save-dev gulp-notify
npm install --save-dev browser-sync 
npm install --save-dev gulp-autoprefixer

npm install --save-dev gulp-less
npm install --save-dev gulp-sourcemaps
npm install --save-dev gulp-clean-css
npm install --save-dev less-plugin-autoprefix
npm install --save-dev run-sequence
npm install --save-dev gulp-ejs

npm install --save-dev proxy-middleware
npm install --save-dev gulp-util

npm install --save-dev vinyl-source-stream vinyl-buffer watchify
npm install --save-dev browserify-shim 
npm install --save-dev brfs

npm install --save-dev gulp-uglify
npm install --save-dev pump
npm install --save-dev gulp-rename

npm install --save-dev gulp-sass

```

Also we can modify the package.json file and 
```
npm i
```

https://github.com/RyanZim/EJS-Lint
npm install ejs-lint

http://blog.berniesumption.com/software/on-abandoning-gulp/
https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/


Configure the modules:
/.jshintrc


## Add the project dependencies

We can use bower and browserify-shim the mamtain this dependencies externalized, but we prefere to have everithing into a js file.

npm install --save bootstrap
npm install --save font-awesome
npm install --save jquery
npm install --save q
npm install --save normalize.css

# This is to clean he html and should not be here
npm install --save htmlclean


# Install handlebars
npm install --save handlebars


# Install datatables
* https://datatables.net/download/npm

npm install --save datatables.net
npm install --save datatables.net-bs


* not needed
// npm install datatables.net-autofill
// npm install datatables.net-autofill-bs

npm install --save datatables.net-buttons
npm install --save datatables.net-buttons-bs

require('datatables.net-buttons')();

require( 'datatables.net-buttons/js/buttons.colVis.js' )(); # Column visibility
require( 'datatables.net-buttons/js/buttons.html5.js' )();  # HTML 5 file export
require( 'datatables.net-buttons/js/buttons.flash.js' )();  # Flash file export
require( 'datatables.net-buttons/js/buttons.print.js' )();  # Print view button


npm install --save datatables.net-colreorder
npm install --save datatables.net-colreorder-bs // Styling via CSS only

// Maybe in a future
// npm install datatables.net-fixedcolumns
// npm install datatables.net-fixedcolumns-bs // Styling via CSS only

npm install --save datatables.net-responsive
npm install --save datatables.net-responsive-bs


# Using the dependencies:

## CSS

1/ coping the existing CSS to a venthors path
2/ integrating the css into the bug css

## Javascript

1/ browserify require
2/ browserify-shim require


# Diffing:
* Using : https://github.com/kpdecker/jsdiff
  * Exemple: http://kpdecker.github.io/jsdiff/
```npm install diff```


* [NEXT: Gulp tasks](/docs/gulp.md)

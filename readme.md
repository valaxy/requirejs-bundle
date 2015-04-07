> This is under development, said on 2015/4/7

RequireJs plugin for package load.

# Install
`bower install --save valaxy/requirejs-bundle`

# config
```javascript
require.config({
    ...
    paths: {
        text: 'bower_components/requirejs-text/text',
        json: 'bower_components/requirejs-plugins/src/json',
        css:  'bower_components/require-css/css.min',

        path: 'bower_components/path/path'
    },

    "valaxy/requirejs-bundle": {
         libBaseUrl: 'bower_components/' // default is '.', muse regular path
    }
    ...
})
```

For now only support plugins: text, json, css

# How to use
```javascript
var package = require('...') // which has a bower.json file
```

## require package only has one module
- `bundle!jquery` -> `bower_components/jquery/dist/jquery.js`
- `bundle!backbone` -> `bower_components/backbone/backbone.js`

## require package has More than one module
- common way
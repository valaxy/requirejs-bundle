define(function (require, exports) {
	//var json = require('json!./packageA/bower.json')
	//console.log(json)
	var packageA = require('bundle!./packageA')
	console.log(packageA)


	exports.init = function () {

	}

})
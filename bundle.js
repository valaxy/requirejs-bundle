define(function (require) {
	var path = require('path')


	var addModule = function (bundle, modulePath, suffix, value) {
		var blocks = modulePath.split(path.sep)
		var current = bundle
		for (var i in blocks) {
			var block = blocks[i]
			if (!current[block]) {
				current[block] = {}
			}
			current = current[block]
		}

		current[suffix] = value
	}

	var getReqModules = function (bundlePath, names) {
		var reqedPaths = []
		var modules = []
		for (var i in names) {
			var modulePath = path.join(bundlePath, names[i])
			var extname = path.extname(modulePath)
			var cleanModulePath = modulePath.slice(0, modulePath.length - extname.length)
			var suffix = extname.slice(1)

			reqedPaths.push((suffix == 'js' ? '' : suffix + '!') + cleanModulePath)
			modules.push({
				path: cleanModulePath,
				suffix: suffix
			})
		}
		return {
			reqedPaths: reqedPaths,
			modules: modules
		}
	}

	var requireModules = function (req, bundlePath, names, done) {
		var bundle = {}
		var requireModules = getReqModules(bundlePath, names)

		req(requireModules.reqedPaths, function () {
			for (var i = 0; i < arguments.length; i++) {
				var value = arguments[i]
				addModule(bundle, requireModules.modules[i].path, requireModules.modules[i].suffix, value)
			}
			done(bundle)
		})
	}

	return {
		load: function (name, req, onload, config) {
			req(['json!' + path.join(name, 'bower.json')], function (bower) {
				if (typeof bower.main == 'string') {
					bower.main = [bower.main]
				}

				requireModules(req, name, bower.main, function (bundle) {
					onload(bundle)
				})
			})
		}
	}
})
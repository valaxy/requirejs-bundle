define(function (require) {
	var path = require('path')

	var getRequirePathString = function (modulePath, suffix) {
		switch (suffix) {
			case 'js':
				return modulePath
			case 'json':
				return suffix + '!' + modulePath + '.json'
			default:
				return suffix + '!' + modulePath
		}
	}

	var addModule = function (bundle, module, value) {
		var suffix = module.suffix
		var moduleName = module.name.slice(0, module.name.length - suffix.length - 1)

		var blocks = moduleName.split(path.sep)
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

	// require('file.suffix') -> require('suffix!file')
	// use other plugin to really load
	var getReqModules = function (bundlePath, names) {
		var reqedPaths = []
		var modules = []
		for (var i in names) {
			var modulePath = path.join(bundlePath, names[i])
			var extname = path.extname(modulePath)
			var cleanModulePath = modulePath.slice(0, modulePath.length - extname.length)
			var suffix = extname.slice(1)

			reqedPaths.push(getRequirePathString(cleanModulePath, suffix))
			modules.push({
				path: cleanModulePath,
				suffix: suffix,
				name: names[i]
			})
		}
		return {
			reqedPaths: reqedPaths,
			modules: modules
		}
	}

	var requireModules = function (req, bundlePath, names, done, libBaseUrl) {
		var bundle = {}
		var requireModules = getReqModules(bundlePath, names)

		req(requireModules.reqedPaths, function () {
			if (arguments.length == 1) {
				done(arguments[0])
			} else {
				for (var i = 0; i < arguments.length; i++) {
					var value = arguments[i]
					addModule(bundle, requireModules.modules[i], value)
				}
				done(bundle)
			}
		})
	}

	return {
		load: function (name, req, onload, config) {
			var myconfig = config['valaxy/requirejs-bundle']
			var libBaseUrl = myconfig ? myconfig.libBaseUrl || '.' : '.'
			name = path.join(libBaseUrl, name)
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
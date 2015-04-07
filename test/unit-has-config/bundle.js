define(function (require) {

	QUnit.module('bundle-config')

	QUnit.test('has-config', function (assert) {
		var pack = require('bundle!has-config')
		assert.equal(pack, "has-config")
	})


})
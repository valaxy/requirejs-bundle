define(function (require) {

	QUnit.module('bundle')

	QUnit.test('mul-module', function (assert) {
		var pack = require('bundle!./mul-module')
		assert.ok(pack)
	})

	QUnit.test('single-module', function (assert) {
		var pack = require('bundle!./single-module')
		assert.equal(pack, "single-module")
	})

})
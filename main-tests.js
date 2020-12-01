/*!
 * OLSKRouting
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var routingLibrary = require('./main');

var OLSKTestingRouteObjectValid = function() {
	return {
		OLSKRoutePath: '/alfa',
		OLSKRouteSignature: 'bravo',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction () {},
	};
};

var OLSKTestingRouteObjectValidRedirect = function() {
	return {
		OLSKRoutePath: '/alfa',
		OLSKRouteRedirect: '/bravo',
	};
};

describe('OLSKRoutingModelIsValid', function test_OLSKRoutingModelIsValid() {

	it('returns false if not object', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(null), false);
	});

	it('returns false if OLSKRoutePath not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRoutePath: null,
		})), false);
	});

	it('returns false if OLSKRouteMethod not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRouteMethod: null,
		})), false);
	});

	it('returns false if OLSKRouteFunction not function', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRouteFunction: null,
		})), false);
	});

	it('returns true', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(OLSKTestingRouteObjectValid()), true);
	});

	describe('OLSKRouteSignature', function() {

		it('returns false if not string', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteSignature: null,
			})), false);
		});

		it('returns false if contains whitespace', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteSignature: ' alfa',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(OLSKTestingRouteObjectValid()), true);
		});

	});

	describe('OLSKRouteIsHidden', function() {

		it('returns false if not boolean', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: 'true',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: true,
			})), true);
		});

	});

	describe('OLSKRouteMiddlewares', function() {

		it('returns false if not array', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: 'alfa',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: ['alfa'],
			})), true);
		});

	});

	describe('OLSKRouteRedirect', function() {

		it('returns false if not string', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(Object.assign(OLSKTestingRouteObjectValidRedirect(), {
				OLSKRouteRedirect: null,
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingModelIsValid(OLSKTestingRouteObjectValidRedirect()), true);
		});

	});

});

describe('OLSKRoutingCanonicalPath', function test_OLSKRoutingCanonicalPath() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			routingLibrary.OLSKRoutingCanonicalPath(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('returns path', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPath('/alfa'), '/alfa');
	});

	it('returns substitutedPath', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPath('/alfa/:bravo', {
			bravo: 'charlie',
		}), '/alfa/charlie');
	});

	it('prepends OLSKRoutingLanguage', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPath('/alfa', {
			OLSKRoutingLanguage: 'en'
		}), '/en/alfa');
	});

	it('prepends OLSKRoutingOrigin', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPath('/alfa', {
			OLSKRoutingOrigin: 'bravo'
		}), 'bravo/alfa');
	});

	it('adds query string for other params', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPath('/alfa', {
			bravo: 'charlie',
		}), '/alfa?bravo=charlie');
	});

});

describe('OLSKRoutingSubstitutionFunction', function test_OLSKRoutingSubstitutionFunction() {

	it('throws error if not string', function() {
		assert.throws(function() {
			routingLibrary.OLSKRoutingSubstitutionFunction(null, []);
		}, /OLSKErrorInputNotValid/);
	});

	it.skip('returns function', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunction('/alfa', []).toString(), (
		function(inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('OLSKErrorInputNotValidMissingInput');
			}

			var substitutedPath = '/alfa';

			(substitutedPath.match(/(:[\w]+(\(.*\))?)/g) || []).forEach(function(e) {
				if (!inputData[e.split(':').pop().split('(').shift()]) {
					throw new Error('OLSKErrorInputNotValidMissingRouteParam');
				}

				substitutedPath = substitutedPath.replace(e, inputData[e.split(':').pop().split('(').shift()]);

				delete inputData[e.split(':').pop().split('(').shift()]
			});

			return substitutedPath;
		}
		).toString());
	});

	context('SubstitutionFunction', function() {

		it('throws error if not object', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingSubstitutionFunction('')();
			}, /OLSKErrorInputNotValidMissingInput/);
		});

		it('returns canonicalPath if no substitutions', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunction('/alfa')({}), '/alfa');
		});

		it('throws error if matching param missing', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingSubstitutionFunction('/alfa/:bravo')({});
			}, /OLSKErrorInputNotValidMissingRouteParam/);
		});

		it('returns substitutedPath for single param', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunction('/alfa/:bravo')({
				bravo: 'charlie',
			}), '/alfa/charlie');
		});

		it('returns substitutedPath for multiple params', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunction('/alfa/:bravo/:delta')({
				bravo: 'charlie',
				delta: 'echo'
			}), '/alfa/charlie/echo');
		});

		it('returns substitutedPath for detailed param', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunction('/alfa/:bravo(\\d+)')({
				bravo: '1',
			}), '/alfa/1');
		});

	});

});

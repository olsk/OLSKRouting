/*!
 * OLSKRouting
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var routingLibrary = require('./main');

var OLSKTestingRouteObjectValid = function() {
	return {
		OLSKRoutePath: '/alpha',
		OLSKRouteMethod: 'get',
		OLSKRouteFunction: function() {},
	};
};

var OLSKTestingRouteObjectValidRedirect = function() {
	return {
		OLSKRoutePath: '/alpha',
		OLSKRouteRedirect: '/bravo',
	};
};

describe('OLSKRoutingInputDataIsRouteObject', function testOLSKRoutingInputDataIsRouteObject() {

	it('returns false if not object', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(null), false);
	});

	it('returns false if OLSKRoutePath not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRoutePath: null,
		})), false);
	});

	describe('OLSKRouteRedirect', function() {

		it('returns false if not string', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValidRedirect(), {
				OLSKRouteRedirect: null,
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(OLSKTestingRouteObjectValidRedirect()), true);
		});

	});

	it('returns false if OLSKRouteMethod not string', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRouteMethod: null,
		})), false);
	});

	it('returns false if OLSKRouteFunction not function', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRouteFunction: null,
		})), false);
	});

	it('returns true', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(OLSKTestingRouteObjectValid()), true);
	});

	describe('OLSKRouteIsHidden', function() {

		it('returns false if not boolean', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: 'true',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteIsHidden: true,
			})), true);
		});

	});

	describe('OLSKRouteMiddlewares', function() {

		it('returns false if not array', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: 'alpha',
			})), false);
		});

		it('returns true', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingInputDataIsRouteObject(Object.assign(OLSKTestingRouteObjectValid(), {
				OLSKRouteMiddlewares: ['alpha'],
			})), true);
		});

	});

});

describe('OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams', function testOLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams() {

	it('throws error if param1 not routeObject', function() {
		assert.throws(function() {
			routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns path', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(OLSKTestingRouteObjectValid()), '/alpha');
	});

	it('returns substitutedPath', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(Object.assign(OLSKTestingRouteObjectValid(), {
			OLSKRoutePath: '/alpha/:bravo',
		}), {
			bravo: 'charlie',
		}), '/alpha/charlie');
	});

	it('returns localized path with OLSKRoutingLanguage', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRouteObjectAndOptionalParams(OLSKTestingRouteObjectValid(), {
			OLSKRoutingLanguage: 'en'
		}), '/en/alpha');

});

describe('OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams', function testOLSKRoutingCanonicalPathWithRoutePathAndOptionalParams() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			routingLibrary.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns path', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams('/alfa'), '/alfa');
	});

	it('returns substitutedPath', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams('/alfa/:bravo', {
			bravo: 'charlie',
		}), '/alfa/charlie');
	});

	it('returns localized path with OLSKRoutingLanguage', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams('/alfa', {
			OLSKRoutingLanguage: 'en'
		}), '/en/alfa');
	});

});

describe('OLSKRoutingSubstitutionFunctionForRoutePath', function testOLSKRoutingSubstitutionFunctionForRoutePath() {

	it('throws error if not string', function() {
		assert.throws(function() {
			routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath(null, []);
		}, /OLSKErrorInputInvalid/);
	});

	it('returns function', function() {
		assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('/alfa', []).toString(), (
		function(inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('OLSKErrorInputInvalidMissingInput');
			}

			var substitutedPath = '/alfa';

			(substitutedPath.match(/(:[\w]+(\(.*\))?)/g) || []).forEach(function(e) {
				if (!inputData[e.split(':').pop().split('(').shift()]) {
					throw new Error('OLSKErrorInputInvalidMissingRouteParam');
				}

				substitutedPath = substitutedPath.replace(e, inputData[e.split(':').pop().split('(').shift()]);
			});

			return substitutedPath;
		}
		).toString());
	});

	context('SubstitutionFunction', function() {

		it('throws error if not object', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('')();
			}, /OLSKErrorInputInvalidMissingInput/);
		});

		it('returns canonicalPath if no substitutions', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('/alpha')({}), '/alpha');
		});

		it('throws error if matching param missing', function() {
			assert.throws(function() {
				routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('/alpha/:bravo')({});
			}, /OLSKErrorInputInvalidMissingRouteParam/);
		});

		it('returns substitutedPath for single param', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('/alpha/:bravo')({
				bravo: 'charlie',
			}), '/alpha/charlie');
		});

		it('returns substitutedPath for multiple params', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('/alpha/:bravo/:delta')({
				bravo: 'charlie',
				delta: 'echo'
			}), '/alpha/charlie/echo');
		});

		it('returns substitutedPath for detailed param', function() {
			assert.strictEqual(routingLibrary.OLSKRoutingSubstitutionFunctionForRoutePath('/alpha/:bravo(\\d+)')({
				bravo: '1',
			}), '/alpha/1');
		});

	});

});

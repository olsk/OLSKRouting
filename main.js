/*!
 * OLSKRouting
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(factory((global.OLSKRouting = global.OLSKRouting || {})));
}(this, (function(exports) {
	'use strict';

//_ OLSKRoutingInputDataIsRouteObject

exports.OLSKRoutingInputDataIsRouteObject = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	}

	if (typeof inputData.OLSKRoutePath !== 'string') {
		return false;
	}

	if (inputData.OLSKRouteRedirect !== undefined) {
		if (typeof inputData.OLSKRouteRedirect !== 'string') {
			return false;
		}

		return true;
	}

	if (typeof inputData.OLSKRouteMethod !== 'string') {
		return false;
	}

	if (typeof inputData.OLSKRouteFunction !== 'function') {
		return false;
	}

	if (inputData.OLSKRouteSignature !== undefined) {
		if (typeof inputData.OLSKRouteSignature !== 'string') {
			return false;
		}

		if (inputData.OLSKRouteSignature.match(/\s/)) {
			return false;
		};
	}

	if (inputData.OLSKRouteIsHidden) {
		if (typeof inputData.OLSKRouteIsHidden !== 'boolean') {
			return false;
		}
	}

	if (inputData.OLSKRouteMiddlewares) {
		if (!Array.isArray(inputData.OLSKRouteMiddlewares)) {
			return false;
		}
	}

	return true;
};

//_ OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams

exports.OLSKRoutingCanonicalPathWithRoutePathAndOptionalParams = function(routePath, optionalParams = {}) {
	if (typeof routePath !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	var canonicalPath = exports.OLSKRoutingSubstitutionFunctionForRoutePath(routePath)(optionalParams);

	if (optionalParams && optionalParams.OLSKRoutingLanguage) {
		canonicalPath = ['/', optionalParams.OLSKRoutingLanguage, canonicalPath].join('');
	}

	return canonicalPath;
};

//_ OLSKRoutingSubstitutionFunctionForRoutePath

exports.OLSKRoutingSubstitutionFunctionForRoutePath = function(routePath) {
	if (typeof routePath !== 'string') {
		throw new Error('OLSKErrorInputInvalid');
	}

	var functionString = (
		function(inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('OLSKErrorInputInvalidMissingInput');
			}

			var substitutedPath = 'OLSKRoutingSubstitutionFunctionTemplate';

			(substitutedPath.match(/(:[\w]+(\(.*\))?)/g) || []).forEach(function(e) {
				if (!inputData[e.split(':').pop().split('(').shift()]) {
					throw new Error('OLSKErrorInputInvalidMissingRouteParam');
				}

				substitutedPath = substitutedPath.replace(e, inputData[e.split(':').pop().split('(').shift()]);
			});

			return substitutedPath;
		}
	).toString().replace('OLSKRoutingSubstitutionFunctionTemplate', routePath);

	var alfa;
	eval('alfa = ' + functionString);
	return alfa;
};

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

})));

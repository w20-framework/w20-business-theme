define([
    '{angular}/angular'
], function(angular) {
    'use strict';

	var module = angular.module('content', []);

	module.controller('ContentController', [ '$scope', function ($scope) {

	}]);

	return {
		angularModules : [ 'content' ]
	};
});

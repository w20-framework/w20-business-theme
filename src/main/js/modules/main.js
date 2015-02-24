define([
    'require',
    'module',

    '{w20-core}/libext/lodash/lodash',
    '{w20-core}/libext/angular/angular',

    '[text]!{w20-business-theme}/templates/topbar.html',
    '[text]!{w20-business-theme}/templates/sidebar.html',

    '{w20-core}/libext/angular/angular-sanitize',
    '{w20-ui}/modules/ui',
    '{w20-ui}/modules/notifications',
    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils'
], function(require, module, _, angular, topbarTemplate, sidebarTemplate) {
    'use strict';

    var w20BusinessTheme = angular.module('w20BusinessTheme', ['w20CoreCulture', 'w20CoreUtils', 'w20UI', 'w20UINotifications', 'ngSanitize', 'ui.bootstrap']),
        _config = module && module.config() || {},
        showTopbar = true,
        showSidebar = true;

    w20BusinessTheme.directive('w20Topbar', ['ApplicationService', 'EnvironmentService', 'DisplayService', 'MenuService',
        function (applicationService, environmentService, displayService, menuService) {
        return {
            template: topbarTemplate,
            replace: true,
            restrict: 'A',
            scope: true,
            link: function (scope, iElement, iAttrs) {
                scope.navActions = menuService.getActions;
                scope.navAction = menuService.getAction;
                scope.envtype = environmentService.environment;
                scope.title = iAttrs.title || '\'' + applicationService.applicationId + '\'';
                scope.description = iAttrs.subtitle || '';
                scope.logoUrl = _config.logoUrl;

                scope.isTopbarDisplayed = function () {
                    return showTopbar;
                };

                displayService.registerContentShiftCallback(function () {
                    return [showTopbar ? 50 : 0, 0, 0, 0];
                });
            }
        };
    }]);

    w20BusinessTheme.run(['$rootScope', 'EventService', 'DisplayService', 'MenuService',
        function ($rootScope, eventService, displayService, menuService) {

            $rootScope.$on('$routeChangeSuccess', function (event, routeInfo) {
                if (routeInfo && routeInfo.$$route) {
                    switch (routeInfo.$$route.navigation) {
                        case 'none':
                            showSidebar = false;
                            showTopbar = false;
                            break;
                        case 'sidebar':
                            showSidebar = true;
                            showTopbar = false;
                            break;
                        case 'topbar':
                            showSidebar = false;
                            showTopbar = true;
                            break;
                        case 'full':
                        /* falls through */
                        default:
                            showSidebar = true;
                            showTopbar = true;
                            break;
                    }

                    displayService.computeContentShift();
                }
            });

            if (!_config.hideSecurity) {
                if (!_config.profileChooser) {
                    menuService.addAction('login', 'w20-login', {
                        sortKey: 100
                    });
                } else {
                    menuService.addAction('profile', 'w20-profile', {
                        sortKey: 100
                    });
                }
            }

            if (!_config.hideConnectivity) {
                menuService.addAction('connectivity', 'w20-connectivity', {
                    sortKey: 200
                });
            }

            if (!_config.hideCulture) {
                menuService.addAction('culture', 'w20-culture', {
                sortKey: 300
            });
            }

            _.each(_config.links, function (link, idx) {
                if (idx < 10) {
                    menuService.addAction('link-' + idx, 'w20-link', _.extend(link, {
                        sortKey: 400 + idx
                    }));
                }
            });

            if (!_config.hideSecurity && !_config.profileChooser) {
                menuService.addAction('logout', 'w20-logout', {
                    sortKey: 1000
                });
            }

            eventService.on('w20.security.authenticated', function () {
                displayService.computeContentShift();
            });

            eventService.on('w20.security.deauthenticated', function () {
                displayService.computeContentShift();
            });

            eventService.on('w20.security.refreshed', function () {
                displayService.computeContentShift();
            });
        }]);


    return {
        angularModules: ['w20BusinessTheme'],
        lifecycle: {
            pre: function (modules, fragments, callback) {
                angular.element('body').addClass('w20-top-shift-padding w20-right-shift-padding w20-bottom-shift-padding w20-left-shift-padding');
                callback(module);
            }
        }
    };
});
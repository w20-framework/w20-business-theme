/*
 * Copyright (c) 2013-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

define([
    'require',
    'module',

    'jquery',
    '{lodash}/lodash',
    '{angular}/angular',

    '[text]!{w20-business-theme}/templates/topbar.html',
    '[text]!{w20-business-theme}/templates/sidebar.html',

    '{angular-sanitize}/angular-sanitize',
    '{w20-core}/modules/ui',
    '{w20-core}/modules/notifications',
    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils'
], function(require, module, $, _, angular, topbarTemplate, sidebarTemplate) {
    'use strict';

    var w20BusinessTheme = angular.module('w20BusinessTheme', ['w20CoreCulture', 'w20CoreUtils', 'w20CoreUI', 'w20CoreNotifications', 'ngSanitize']),
        _config = module && module.config() || {},
        showTopbar = true,
        showSidebar = _config.sidebar && typeof _config.sidebar.show == 'boolean' ? _config.show : true;

    w20BusinessTheme.directive('w20Topbar', ['ApplicationService', 'EventService', 'EnvironmentService', 'DisplayService', 'MenuService',
        function (applicationService, eventService, environmentService, displayService, menuService) {
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
                scope.logo = _config.logo;
                scope.brandFixedWidth = true;
                if (_config.brand) {
                    scope.brandFixedWidth = _config.brand.fixedWidth === false ? _config.brand.fixedWidth : true;
                    scope.brandBackgroundColor = _config.brand.backgroundColor ?  _config.brand.backgroundColor : undefined;
                    scope.brandTextColor = _config.brand.textColor ?  _config.brand.textColor : undefined;
                }

                scope.showTopbar = function () {
                    return showTopbar;
                };

                scope.toggleSidebar = function() {
                    eventService.emit('SidebarToggleEvent');
                };

                displayService.registerContentShiftCallback(function () {
                    return [showTopbar ? 50 : 0, 0, 0, 0];
                });
            }
        };
    }]);

    w20BusinessTheme.directive('w20Sidebar', ['EventService', 'DisplayService', 'NavigationService', 'MenuService', '$location', '$window',
        function (eventService, displayService, navigationService, menuService, $location, $window) {
            return {
                template: sidebarTemplate,
                replace: true,
                restrict: 'A',
                scope: true,
                link: function (scope) {
                    var previousSidebarState = showSidebar;

                    if (_config.sidebar) {
                        scope.sideBarWidth = _config.sidebar.width ? _config.sidebar.width : undefined;
                    }

                    scope.menuSections = menuService.getSections;
                    scope.menuActiveSectionName = scope.menuSections()[0];

                    scope.showSidebar = function () {
                        return showSidebar;
                    };

                    scope.menuSection = function (name) {
                        return name ? menuService.getSection(name) : null;
                    };

                    eventService.on('SidebarToggleEvent', function() {
                        showSidebar = !showSidebar;
                        previousSidebarState = showSidebar;
                        displayService.computeContentShift();
                    });

                    displayService.registerContentShiftCallback(function () {
                        return [10, 0, 0, showSidebar ? (scope.sideBarWidth || 270) : 0];
                    });

                    angular.element($window).bind('resize', function () {
                        showSidebar = $(window).width() < 768 ? false : previousSidebarState;
                        scope.$apply();
                        displayService.computeContentShift();
                    });
                }
            };
    }]);

    w20BusinessTheme.filter('routeFilter', ['CultureService', 'SecurityExpressionService', function(cultureService, securityExpressionService) {
        function isRouteVisible(route) {
            return !route.hidden && (typeof route.security === 'undefined' || securityExpressionService.evaluate(route.security));
        }
        return function(routes, expected) {
            if (!expected) {
                return;
            }
            return _.filter(routes, function(route) {
                if(isRouteVisible(route) && cultureService.displayName(route).toLowerCase().indexOf(expected.toLowerCase()) !== -1) {
                    return route;
                }
            });
        };
    }]);

    w20BusinessTheme.controller('W20btViewsController', ['$scope', 'NavigationService', 'CultureService', '$route', '$location',
        function ($scope, navigationService, cultureService, $route, $location) {

            var openedCategories = navigationService.expandedRouteCategories();

            function recursiveOpen(tree) {
                openedCategories.push(tree.categoryName);
                for (var key in tree) {
                    if (tree.hasOwnProperty(key)) {
                        var subTree = tree[key];
                        if (subTree instanceof Array) {
                            recursiveOpen(subTree);
                        }
                    }
                }
            }

            $scope.linkPrefix = $location.$$html5 ? '' : '#!';
            $scope.routes = $route.routes;
            $scope.filteredRoutes = [];
            $scope.menuTree = navigationService.routeTree;
            $scope.subMenuTree = navigationService.computeSubTree;
            $scope.topLevelCategories = navigationService.topLevelRouteCategories;
            $scope.topLevelRoutes = navigationService.topLevelRoutes;
            $scope.routesFromCategory = navigationService.routesFromCategory;
            $scope.displayName = cultureService.displayName;

            if (_config.brand) {
                $scope.brandColor =  _config.brand.backgroundColor ? _config.brand.backgroundColor : undefined;
            }

            $scope.activeRoutePath = function() {
               return $location.path();
            };

            $scope.localizeCategory = function (categoryName) {
                var lastPartIndex = categoryName.lastIndexOf('.');
                if (lastPartIndex !== -1) {
                    return cultureService.localize('application.viewcategory.' + categoryName, undefined, null) || cultureService.localize('application.viewcategory.' + categoryName.substring(lastPartIndex + 1));
                } else {
                    return cultureService.localize('application.viewcategory.' + categoryName);
                }
            };

            $scope.toggleTree = function (tree) {
                if ($scope.isOpened(tree.categoryName)) {
                    openedCategories.splice(openedCategories.indexOf(tree.categoryName), 1);
                } else {
                    openedCategories.push(tree.categoryName);
                }
            };

            $scope.isOpened = function (categoryName) {
                return _.contains(openedCategories, categoryName);
            };

            $scope.routeSortKey = function (route) {
                return route.sortKey || route.path;
            };
        }]);

    w20BusinessTheme.run(['$rootScope', 'EventService', 'DisplayService', 'MenuService', 'CultureService',
        function ($rootScope, eventService, displayService, menuService, cultureService) {

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

            menuService.addSection('views', 'w20-views', {
                templateUrl: '{w20-business-theme}/templates/sidebar-views.html'
            });

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
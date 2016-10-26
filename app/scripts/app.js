'use strict';

/**
 * @ngdoc overview
 * @name siteApp
 * @description
 * # siteApp
 *
 * Main module of the application.
 */
angular
  .module('siteApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    '720kb.socialshare'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/redwoods', {
        templateUrl: 'views/redwoods.html',
        controller: 'RedwoodsCtrl',
        controllerAs: 'redwoods'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/slovenia', {
        templateUrl: 'views/slovenia.html',
        controller: 'SloveniaCtrl',
        controllerAs: 'slovenia'
      })
      .when('/slovenia-part-2', {
        templateUrl: 'views/slovenia-part-2.html',
        controller: 'SloveniaPart2Ctrl',
        controllerAs: 'sloveniaPart2'
      })
      .when('/omaha', {
        templateUrl: 'views/omaha.html',
        controller: 'OmahaCtrl',
        controllerAs: 'omaha'
      })
      .when('/blip', {
        templateUrl: 'views/blip.html',
        controller: 'BlipCtrl',
        controllerAs: 'blip'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

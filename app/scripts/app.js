'use strict';

angular.module('mismatchApp', ['ngRoute', 'mismatchControllers'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      })
    }
  ])
  .run(['$rootScope', function($rootScope) {

  }
]);
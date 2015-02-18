'use strict';

angular.module('mismatchControllers', []);
angular.module('mismatchServices', []);

angular.module('mismatchApp', ['ngRoute', 'mismatchControllers', 'mismatchServices'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
    }
]);

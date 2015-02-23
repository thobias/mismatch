'use strict';

angular.module('mismatchControllers', []);
angular.module('mismatchServices', []);
angular.module('mismatchResources', []);

angular.module('mismatchApp', ['ngRoute', 'mismatchControllers', 'mismatchServices', 'mismatchResources'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      }).
      when('/trial', {
        templateUrl: 'views/trial.html',
        controller: 'TrialCtrl'
      }).
      when('/calibration', {
        templateUrl: 'views/calibration.html',
        controller: 'CalibrationCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
    }
]);

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
        controller: 'TrialCtrl',
        resolve: {
          trials: function($location, $rootScope) {
            if(!$rootScope.experiment) { $location.path('/start'); }

            return $rootScope.experiment['trials'];
          },
        }
      }).
      when('/preTrial', {
        templateUrl: 'views/preTrial.html',
        controller: 'PreTrialCtrl',
        resolve: {
          trials: function($location, $rootScope) {
            if(!$rootScope.experiment) { $location.path('/start'); }

            return $rootScope.experiment['preTrials'];
          },
        }
      }).
      otherwise({
        redirectTo: '/start'
      });
    }
]);

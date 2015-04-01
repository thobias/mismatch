'use strict';

angular.module('mismatchControllers', []);
angular.module('mismatchServices', []);
angular.module('mismatchResources', []);
angular.module('mismatchDirectives', []);

angular.module('mismatchApp', ['ngRoute', 'mismatchControllers', 'mismatchServices', 'mismatchResources', 'mismatchDirectives'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      }).
      when('/trial', {
        templateUrl: 'views/firstTrials.html',
        controller: 'TrialCtrl'
      }).
      when('/preTrial', {
        templateUrl: 'views/preTrial.html',
        controller: 'PreTrialCtrl'
      }).
      when('/postTrial', {
        templateUrl: 'views/postTrials.html',
        controller: 'PostTrialCtrl'
      }).
      when('/view', {
        templateUrl: 'views/viewData.html',
        controller: 'ViewDataCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
    }
]);

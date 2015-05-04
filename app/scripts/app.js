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
      when('/experiments/:id/trials', {
        templateUrl: 'views/viewExperimentTrials.html',
        controller: 'ExperimentsViewCtrl'
      }).
      when('/experiments/:id', {
        templateUrl: 'views/viewExperiment.html',
        controller: 'ExperimentsListCtrl'
      }).
      when('/users/:id', {
        templateUrl: 'views/viewUser.html',
        controller: 'UserCtrl'
      }).
      when('/turk', {
        templateUrl: 'views/turk.html',
        controller: 'TurkCtrl'
      }).
      otherwise({
        redirectTo: '/start'
      });
    }
]);

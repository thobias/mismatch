'use strict';

angular.module('mismatchControllers')
  .controller('StartCtrl', ['$scope', '$rootScope', 'experiment', function($scope, $rootScope, experiment) {
    // One resource with user data, the trials and experiment data (when finished)
    $rootScope.experiment = experiment;

    // User metadata
    // Test trials
    // Experiment #1
    // Experiment #2
    // Outro
  }])
  .controller('TrialCtrl', ['$scope', 'trials', 'trial', function($scope, trials, trial) {
    var trials = trials;

    var getTrial = function(index) {

      if( !trials[ index ] || trials[ index ] === undefined) {
        return false;
      }

      return trial({
        'id': trials[ index ].id,
        'image1': trials[ index ].image1,
        'image2': trials[ index ].image2,
        'manipulated': trials[ index ].manipulated
      });

    };

    var startTrial = function() {

      $scope.trial.start().then(function(data) {
        trials[$scope.currentTrialIndex].data = angular.copy(data);

        $scope.currentTrialIndex++;

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;

          return true;
        }

        $scope.trial = getTrial($scope.currentTrialIndex);
      });

    };

    $scope.currentTrialIndex  = 0;
    $scope.trial              = getTrial($scope.currentTrialIndex);
    $scope.startTrial         = startTrial;
    $scope.finished           = false;

  }])
  .controller('PreTrialCtrl', ['$scope', 'mouseTracking', 'trials', 'trial', function($scope, mouseTracking, trials, trial) {
    var trials = trials;

    var getTrial = function(index) {

      if( !trials[ index ] || trials[ index ] === undefined) {
        return false;
      }

      return trial({
        'id': trials[ index ].id,
        'image1': trials[ index ].image1,
        'image2': trials[ index ].image2,
        'manipulated': trials[ index ].manipulated
      });

    };

    var startTrial = function() {

      mouseTracking.calibration().then(function(updatingFrequency) {
        mouseTracking.setUpdatingFrequency(updatingFrequency);
        // Save to experiment?
        console.log('Updating frequency set to ' + mouseTracking.updatingFrequency + ' ms (' + 1000/mouseTracking.updatingFrequency + ' hz)');
      });

      $scope.trial.start().then(function(data) {
        $scope.currentTrialIndex++;

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;
          return true;
        }

        $scope.trial = getTrial( $scope.currentTrialIndex );
      });

    };

    $scope.currentTrialIndex  = 0;
    $scope.trial              = getTrial($scope.currentTrialIndex);
    $scope.startTrial         = startTrial;
    $scope.started            = false;
    $scope.finished           = false;

  }])
  .controller('PostTrialCtrl', ['$scope', '$rootScope', '$location', 'mouseTracking', 'trials', 'trial', function($scope, $rootScope, $location, mouseTracking, trials, trial) {
    var trials = trials;

    var getTrial = function(index) {

      if( !trials[ index ] || trials[ index ] === undefined) {
        return false;
      }

      return trial({
        'id': trials[ index ].id,
        'image1': trials[ index ].image1,
        'image2': trials[ index ].image2,
        'manipulated': false,
        'onlyChoose': true
      });

    };

    var startTrial = function() {

      $scope.trial.start().then(function(data) {
        console.log(data);
        trials[$scope.currentTrialIndex].data = angular.copy(data);

        $scope.currentTrialIndex++;

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;
          // Save data to DB?
          return true;
        }

        $scope.trial = getTrial( $scope.currentTrialIndex );
      });

    };

    var completeExperiment = function() {
      console.log($rootScope.experiment);
      localStorage.setItem($rootScope.experiment.id, JSON.stringify($rootScope.experiment));

      var url = 'data:text/json;charset=utf8,' + JSON.stringify( $rootScope.experiment );
      window.open(url, '_blank');

      $location.path('/start');
    };

    $scope.currentTrialIndex  = 0;
    $scope.trial              = getTrial($scope.currentTrialIndex);
    $scope.startTrial         = startTrial;
    $scope.started            = false;
    $scope.finished           = false;
    $scope.completeExperiment = completeExperiment;

  }]);

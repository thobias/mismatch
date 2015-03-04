'use strict';

angular.module('mismatchControllers')
  .controller('StartCtrl', ['$scope', '$rootScope', 'experiment', function($scope, $rootScope, experiment) {
    // One resource with user data, the trials and experiment data (when finished)
    $rootScope.experiment = experiment;

    // Calibration
    // User metadata
    // First trials
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
        console.log(data);

        if( !getTrial( $scope.currentTrialIndex ) ) {
          $scope.finished = true;
          // Save data to database
          return true;
        }

        $scope.currentTrialIndex++;
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

  }]);

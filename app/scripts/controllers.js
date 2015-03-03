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
  .controller('TrialCtrl', ['$scope', '$rootScope', '$location', 'trial', function($scope, $rootScope, $location, trial) {
    $scope.experiment = $rootScope.experiment;

    if(!$scope.experiment) {
      $location.path('/start');
    }

    var getTrial = function(index) {
      return trial({
        'id': $scope.experiment.trials[ index ].id,
        'image1': $scope.experiment.trials[ index ].image1,
        'image2': $scope.experiment.trials[ index ].image2,
        'manipulated': $scope.experiment.trials[ index ].manipulated
      });
    };

    $scope.currentTrialIndex = 0;

    $scope.trial = getTrial($scope.currentTrialIndex);

    if($scope.experiment === undefined) {
      $location.path('/start');
    }

    // Get data
    // Set images
    // Flipping of images
    // Is manipulated?
    // Show likert scale for judgement
    // Goto next trial

    // Click
    // Wait
    // FLip images
    // Wait 2s
    // Choice is made
    // Flip images
    // Show scale
    // Click scale
    // Show chosen (or manipulated) image
    // Wait 2s?
    // Show reasons
    // Choose reason
    // Next trial


    var startTrial = function() {

      $scope.trial.start().then(function(data) {
        console.log(data);
        $scope.currentTrialIndex++;
        $scope.trial = getTrial($scope.currentTrialIndex);
      });

    };


    $scope.startTrial = startTrial;
    //$scope.stopTracking = stopTracking;

  }])
  .controller('CalibrationCtrl', ['$scope', '$location', 'mouseTracking', function($scope, $location, mouseTracking) {

    var startCalibration = function() {
      mouseTracking.calibration().then(function(updatingFrequency) {
        mouseTracking.setUpdatingFrequency(updatingFrequency);
        console.log('Updating frequency set to ' + mouseTracking.updatingFrequency + ' ms (' + 1000/mouseTracking.updatingFrequency + ' hz)');
        $location.path('/trial');
      });
    };

    $scope.startCalibration = startCalibration;

  }]);

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
  .controller('TrialCtrl', ['$scope', '$rootScope', '$location', 'mouseTracking', function($scope, $rootScope, $location, mouseTracking) {
    $scope.experiment = $rootScope.experiment;
    $scope.trial = 0;

    if($scope.experiment === undefined) {
      $location.path('/start');
    }

    // Get data
    // Set images
    // Flipping of images
    // Is manipulated?
    // Goto next trial

    var stopTracking = function() {
      var results = mouseTracking.stopTracking();
      $scope.experiment.data[$scope.trial] = angular.copy(results);
      $scope.trial++;
      console.log($scope.experiment);
    };

    $scope.startTracking = mouseTracking.startTracking;
    $scope.stopTracking = stopTracking;

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

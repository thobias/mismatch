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
  .controller('ViewDataCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.input = '';
    $scope.result = '';

    $scope.process = function() {
      var experiments = JSON.parse($scope.input);
      var result = 'x, y, t, rt, r, tid, eid, m, d\n';

      $.each(experiments, function() {

        var experiment = this;

        $.each(experiment.trials, function() {
          var trial = this;
          var rows = trial.data.tracking.split('\n');

          var firstTime = false;
          var firstX = false;
          var firstY = false;

          $.each(rows, function() {
            var column = this.split(', ');

            firstTime = firstTime ? firstTime : column[2];

            // 500ms delay, 600ms animation, 2000 ms dislay time, 600ms animation
            if(column[0] && column[1] && column[2] && column[2] - firstTime > 3700.0) {
              firstX = firstX ? firstX : column[0];
              firstY = firstY ? firstY : column[1];
              //result = result + (column[0] - firstX) + ', ' + (firstY - column[1]) + ', ' + (column[2] - firstTime) + ', ' + (trial.data.timing.choice - trial.data.timing.start) + ', ' + trial.data.rating + ', ' + trial.id + ', ' + experiment.id + ', ' + (trial.manipulated ? 1 : 0) + ', ' + (trial.data.reason == "other" ? 1 : 0) + '\n';
              result = result + (column[0]) + ', ' + (column[1]) + ', ' + (column[2] - firstTime) + ', ' + (trial.data.timing.choice - trial.data.timing.start) + ', ' + trial.data.rating + ', ' + trial.id + ', ' + experiment.id + ', ' + (trial.manipulated ? 1 : 0) + ', ' + (trial.data.reason == "other" ? 1 : 0) + '\n';
            }
          });
        });

      });


      $scope.result = result;
    };


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
